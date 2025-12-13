const formatTimeWithMs = (date = new Date()) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
}

const formatMessage = (level, namespace) => {
    return `${formatTimeWithMs()} [${level}] [${namespace}]`
}

/**
 * 创建日志
 * @param {string} namespace - 命名空间
 * @returns {{debug: function(...[*]): void, info: function(...[*]): void, warn: function(...[*]): void, error: function(...[*]): void}}
 */
const createLogger = (namespace = 'GLOBAL') => {
    return {
        debug: (...args) => console.log(formatMessage('DEBUG', namespace), ...args),
        info: (...args) => console.info(formatMessage('INFO', namespace), ...args),
        warn: (...args) => console.warn(formatMessage('WARN', namespace), ...args),
        error: (...args) => console.error(formatMessage('ERROR', namespace), ...args),
    }
}

const logger = createLogger();

export {
    createLogger,
    logger
}