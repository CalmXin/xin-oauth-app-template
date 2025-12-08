from enum import Enum


class ErrorCodeEnum(Enum):
    """错误类的错误码"""

    # JWT
    JWT_INVALID = 'jwt_invalid'  # JWT 无效
    JWT_UNEXCEPTED = 'jwt_unexpected'  # JWT 出现未预期的错误
    JWT_MISSING_CONDITION = 'jwt_missing_condition'  # JWT 缺少条件

    # HTTP
    HTTP_REQUEST_FAILED = 'http_request_failed'  # HTTP 请求失败

    # JSON
    JSON_DECODE_ERROR = 'json_decode_error'  # JSON 解码错误


class AppException(Exception):
    """自定义错误类"""

    def __init__(self, code: ErrorCodeEnum, message: str, details: dict | None = None):
        self.code = code
        self.message = message
        self.details = details or {}
        super().__init__(message)

    def __repr__(self):
        return (
            f'{self.__class__.__name__}'
            f'('
            f'code={self.code!r}, '
            f'message={self.message!r}, '
            f'details={self.details!r}'
            f')'
        )
