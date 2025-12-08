from diskcache import Cache

from app.core.constants import WORK_DIR

_cache_file_path = WORK_DIR / 'data' / 'cache'
_cache_file_path.mkdir(parents=True, exist_ok=True)

cache = Cache(f'{_cache_file_path}')
