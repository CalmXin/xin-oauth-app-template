import {createLogger} from "@/utils/logger.js";

const logger = createLogger('store')

class AppStorage {

    constructor(namespace) {
        this.namespace = namespace ?? 'app'
    }

    /**
     * 加上前缀的 key
     * @param {string} key - 键
     * @returns {string}
     * @private
     */
    _fullKey(key) {
        return `${this.namespace}:${key}`
    }

    /**
     * 设置数据
     * @param {string} key
     * @param {string} value
     * @returns {boolean}
     */
    set(key, value) {
        const fullKey = this._fullKey(key)

        try {
            localStorage.setItem(fullKey, JSON.stringify(value))
            logger.info(`${key} 插入成功`)
            return true
        } catch (e) {
            logger.error(`${key} 插入失败 ${e}`)
            return false
        }
    }

    /**
     * 获取数据
     * @param {string} key
     * @returns {string | null}
     */
    get(key) {
        const fullKey = this._fullKey(key)
        const value = localStorage.getItem(fullKey)
        if (value === null) {
            return null
        } else {
            return JSON.parse(value)
        }
    }

    /**
     * 删除数据
     * @param {string} key
     */
    remove(key) {
        const fullKey = this._fullKey(key)
        localStorage.removeItem(fullKey)
    }

    /**
     * 清空数据
     * @returns {boolean}
     */
    clearAll() {
        try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.namespace)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true
        } catch (e) {
            logger.error(`清空数据失败 ${e}`)
            return false
        }
    }

    /**
     * 判断数据是否存在
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== null;
    }
}

const appStore = new AppStorage('app')

export {
    appStore,
    AppStorage
}