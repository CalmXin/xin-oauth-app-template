import anyio
import httpx
from jose import jwt, jwk, JWTError

from app.core.cache import cache
from app.core.settings import env_getter


class JwtUtil:
    """JWT 工具类"""

    _jwt_lock = anyio.Lock()

    JWKS_KEY = 'jwks'
    ISSUER = env_getter.auth_endpoint

    def __init__(self):
        self.cache = cache

    @staticmethod
    async def _fetch_jwks() -> dict:
        """获取 JWKS"""

        async with httpx.AsyncClient() as client:
            resp = await client.get(f'{env_getter.auth_endpoint}/.well-known/jwks')
            resp.raise_for_status()
            return resp.json()

    async def get_jwks(self) -> dict:
        """获取 JWKS，使用锁避免重复请求"""

        cached_jwks = self.cache.get(self.JWKS_KEY)

        if cached_jwks is None:
            async with self._jwt_lock:
                if cached_jwks is None:
                    jwks = await self._fetch_jwks()
                    self.cache.set(self.JWKS_KEY, jwks, expire=3600)
                    return jwks

        return cached_jwks

    @staticmethod
    def _match_audience(token_aud: str | list[str], expected_aud: str | list[str]) -> bool:
        """校验 audience 是否匹配"""

        if isinstance(token_aud, str):
            token_aud = [token_aud]

        if isinstance(expected_aud, str):
            expected_aud = [expected_aud]

        return any(aud in expected_aud for aud in token_aud)

    async def verify_jwt_token(
            self,
            token: str,
            expected_audience: str | list[str],
    ) -> dict:
        """
        通用 JWT 验证函数，适用于 id_token 和 access_token

        Args:
            token: 要验证的 JWT 字符串
            expected_audience: 期望的 audience（如 client_id 或 Casdoor API 地址）

        Returns:
            解码后的 payload（已验证）

        Raises:
            ValueError: 验证失败
        """

        try:
            # 1. 获取未验证的 header 以提取 kid
            header = jwt.get_unverified_header(token)
            kid = header.get("kid")
            if not kid:
                raise ValueError("Missing 'kid' in JWT header")

            # 2. 获取 JWKS 并查找公钥
            jwks = await self.get_jwks()
            public_key = None
            for key in jwks["keys"]:
                if key.get("kid") == kid:
                    public_key = jwk.construct(key)
                    break

            if public_key is None:
                raise ValueError(f"No public key found for kid={kid}")

            # 3. 先不验证 aud/iss/exp，只验证签名，以便自定义 aud 校验
            unverified_payload = jwt.decode(
                token,
                public_key.to_pem().decode("utf-8"),
                algorithms=["RS256"],
                options={
                    "verify_signature": True,
                    "verify_aud": False,
                    "verify_iss": False,
                    "verify_exp": False,
                }
            )

            # 4. 手动校验 iss
            if unverified_payload.get("iss") != self.ISSUER:
                raise ValueError(
                    f"Invalid issuer. Expected {self.ISSUER}, got {unverified_payload.get('iss')}")

            # 5. 手动校验 aud
            token_aud = unverified_payload.get("aud")
            if not token_aud:
                raise ValueError("Missing 'aud' claim")

            if not self._match_audience(token_aud, expected_audience):
                raise ValueError(f"Audience mismatch. Token aud: {token_aud}, expected: {expected_audience}")

            # 6. 手动校验 exp/nbf/iat（带容差）
            jwt.decode(
                token,
                public_key.to_pem().decode("utf-8"),
                algorithms=["RS256"],
                issuer=self.ISSUER,
                audience=expected_audience,
                options={
                    "verify_signature": False,  # 已验证过
                    "verify_aud": True,
                    "verify_iss": True,
                    "verify_exp": True,
                },
            )

            return unverified_payload

        except JWTError as e:
            raise ValueError(f"JWT validation failed: {str(e)}")

        except Exception as e:
            raise ValueError(f"Unexpected error during JWT verification: {str(e)}")
