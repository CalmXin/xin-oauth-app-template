from typing import Any

import anyio.to_thread
from diskcache import Cache

from app.core.constants import WORK_DIR

_cache_file_path = WORK_DIR / 'data' / 'cache'
_cache_file_path.mkdir(parents=True, exist_ok=True)


class AsyncCache:
    """异步缓存类"""

    def __init__(self, cache_file_path: str):
        self._cache = Cache(cache_file_path)

    async def get(self, key: str, default: Any | None = None) -> Any:
        return await anyio.to_thread.run_sync(self._cache.get, key, default)

    async def set(self, key: str, value: Any, expire: int | None = None) -> bool:
        return await anyio.to_thread.run_sync(self._cache.set, key, value, expire)

    async def delete(self, key: str) -> bool:
        return await anyio.to_thread.run_sync(self._cache.delete, key)


cache = AsyncCache(str(_cache_file_path))
