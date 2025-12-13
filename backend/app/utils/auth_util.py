import secrets

from itsdangerous import URLSafeSerializer, BadSignature
from starlette.requests import Request
from starlette.responses import Response

from app.core.settings import env_getter

serializer = URLSafeSerializer(env_getter.app_secret_key)


def make_state() -> str:
    """生成 state"""

    return secrets.token_urlsafe(32)


def set_state_cookie(response: Response, state: str) -> None:
    """设置 state cookie"""

    signed = serializer.dumps(state)
    response.set_cookie(
        key=env_getter.auth_state_cookie_name,
        value=signed,
        httponly=True,
        secure=False,  # 生产环境设为 True（需 HTTPS）
        samesite="lax"
    )


def verify_state(request: Request, received_state: str) -> bool:
    """验证 state"""

    signed = request.cookies.get(env_getter.auth_state_cookie_name)
    if not signed:
        return False

    try:
        original = serializer.loads(signed)
        return original == received_state

    except BadSignature:
        return False
