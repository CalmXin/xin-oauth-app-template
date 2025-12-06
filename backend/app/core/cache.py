from diskcache import Cache

from app.core.constants import WORK_DIR

cache_file_path = WORK_DIR / 'data' / 'cache'
cache_file_path.mkdir(parents=True, exist_ok=True)

cache = Cache(f'{cache_file_path}')
