import secrets

from itsdangerous import URLSafeSerializer

from app.core.cache import cache
from app.core.settings import env_getter

serializer = URLSafeSerializer(env_getter.app_secret_key)


def make_state() -> str:
    """生成 state"""

    return secrets.token_urlsafe(32)


async def set_state_cache(state: str) -> None:
    """设置 state"""

    await cache.set(f'{env_getter.auth_state_key_name}:{state}', '1', expire=5 * 60)  # 缓存 5 分钟


async def verify_state(received_state: str) -> bool:
    """验证 state"""

    signed = await cache.get(f'{env_getter.auth_state_key_name}:{received_state}')
    if not signed:
        return False

    await cache.delete(f'{env_getter.auth_state_key_name}:{received_state}')  # 验证存在后删除
    return True
