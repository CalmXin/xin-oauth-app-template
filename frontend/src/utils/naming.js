/**
 * 将 snake_case 字符串转为 camelCase
 * @param {string} str
 * @returns {string}
 */
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * 递归将对象或数组中的所有 key 从 snake_case 转为 camelCase
 * @param {any} data - 可以是 object、array 或其他类型
 * @returns {any} 转换后的数据
 */
function transformKeysToCamel(data) {
    if (Array.isArray(data)) {
        return data.map(item => transformKeysToCamel(item));
    }

    if (data !== null && typeof data === 'object') {
        const newObj = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const newKey = snakeToCamel(key);
                newObj[newKey] = transformKeysToCamel(data[key]);
            }
        }
        return newObj;
    }

    // 基本类型（string, number, boolean, null 等）直接返回
    return data;
}

export {
    snakeToCamel,
    transformKeysToCamel
}