from enum import Enum
from pathlib import Path

WORK_DIR = Path(__file__).parents[2]


# ========== HTTP ==========

class HttpCodeEnum(Enum):
    """HTTP 状态码枚举"""

    OK = 200  # 请求成功
    NO_CONTENT = 204  # 请求成功，但无内容

    MOVED_PERMANENTLY = 301  # 永久重定向
    FOUND = 302  # 临时重定向

    BAD_REQUEST = 400  # 请求错误
    UNAUTHORIZED = 401  # 未授权
    FORBIDDEN = 403  # 禁止访问
    NOT_FOUND = 404  # 未找到
    METHOD_NOT_ALLOWED = 405  # 方法不允许

    ERROR = 500  # 服务器错误
