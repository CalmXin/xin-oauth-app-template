/**
 * 错误码常量（模拟 Enum）
 */
const ErrorCode = {
    // HTTP
    HTTP_REQUEST_FAILED: 'http_request_failed',

    // JSON
    JSON_DECODE_ERROR: 'json_decode_error',
};

// 冻结对象，防止意外修改（可选）
Object.freeze(ErrorCode);

// 预先生成合法值集合，用于快速校验
const VALID_ERROR_CODES = new Set(Object.values(ErrorCode));

/**
 * 自定义应用异常类
 */
class AppError extends Error {

    /**
     * @param {string} code - 来自 ErrorCode 的错误码
     * @param {string} message - 错误信息
     * @param {Object|null} [details=null] - 附加错误详情（可选）
     */
    constructor(code, message, details = null) {
        // 强制校验 code 是否合法
        if (!VALID_ERROR_CODES.has(code)) {
            const allowed = Array.from(VALID_ERROR_CODES).join(', ');
            throw new TypeError(
                `Invalid error code: "${code}". Must be one of: ${allowed}`
            );
        }

        super(message);
        this.name = 'AppException';
        this.code = code;
        this.message = message;
        this.details = details || {};

        // 保留原始调用栈（在部分引擎中需要）
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }

    /**
     * 转换为普通对象，便于日志记录或返回给前端
     * @returns {{code: string, message: string, details: Object}}
     */
    toObject() {
        return {
            code: this.code,
            message: this.message,
            details: this.details,
        };
    }

    /**
     * 自定义字符串表示（类似 Python 的 __str__）
     */
    toString() {
        return `[${this.code}] ${this.message}`;
    }
}

// 导出（适用于 ES 模块环境）
export {ErrorCode, AppError};
