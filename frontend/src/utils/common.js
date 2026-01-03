import appConfig from "@/config.js";

/**
 * 判断值是否为空
 * @param {*} value
 * @returns {boolean}
 */
const isEmpty = (value) => {
    // null 或 undefined
    if (value == null) return true;

    // 字符串：trim 后为空
    if (typeof value === 'string') return value.trim() === '';

    // 数组：长度为 0
    if (Array.isArray(value)) return value.length === 0;

    // 对象：没有自有可枚举属性
    if (typeof value === 'object') return Object.keys(value).length === 0;

    // 其他情况（数字、布尔、函数等）：非空
    return false;
}

/**
 * 修改标题
 * @param {string} title
 */
const changeTitle = (title) => {
    document.title = `${title} - ${appConfig.appName}`
}

/**
 * 检查是否为移动屏幕
 * @returns {boolean}
 */
const checkIsMobileScreen = () => {
    return window.innerWidth <= 768
}

export {
    isEmpty,
    changeTitle,
    checkIsMobileScreen,
}