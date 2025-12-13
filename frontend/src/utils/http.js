import {AppError, ErrorCode} from "@/utils/error.js";
import CONFIG from "@/config.js";


class Http {

    /**
     * 创建 HTTP 实例
     * @param {string} baseURL
     * @param {number} timeout
     */
    constructor(baseURL, timeout = 120 * 1000) {
        this.baseURL = baseURL
        this.timeout = timeout
    }

    /**
     * 发送 HTTP 请求
     * @param {string} url
     * @param {object} options
     * @returns {Promise<object>}
     * @throws {AppError}
     */
    async request(url, options = {}) {
        const fullUrl = url.startsWith('/') ? `${this.baseURL}${url}` : url
        const config = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        }

        // 设置超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(fullUrl, {
                ...config,
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new AppError(
                    ErrorCode.HTTP_REQUEST_FAILED,
                    `HTTP ${response.status} ${response.statusText}`,
                    {
                        'response': await response.json()
                    }
                )
            }

            return await response.json()
        } catch (e) {
            if (e instanceof AppError) {
                throw e
            } else if (e.name === 'AbortError') {
                throw new AppError(ErrorCode.HTTP_TIMEOUT, e.message)
            } else {
                throw new AppError(ErrorCode.HTTP_REQUEST_FAILED, e.message)
            }
        } finally {
            clearTimeout(timeoutId)
        }
    }

    /**
     * 发送 GET 请求
     * @param {string} url
     * @param {object} data
     * @param {object} options
     * @returns {Promise<object>}
     * @throws {AppError}
     */
    async get(url, data, options = {}) {
        const query = data ? `?${new URLSearchParams(data).toString()}` : ''
        const fullUrl = data ? `${url}${query}` : url
        return this.request(fullUrl, {method: 'GET', ...options})
    }

    /**
     * 发送 POST 请求
     * @param {string} url
     * @param {object} data
     * @param {object} options
     * @returns {Promise<object>}
     * @throws {AppError}
     */
    async post(url, data, options = {}) {
        return this.request(url, {method: 'POST', body: JSON.stringify(data), ...options})
    }

    /**
     * 发送 PUT 请求
     * @param {string} url
     * @param {object} data
     * @param {object} options
     * @returns {Promise<object>}
     * @throws {AppError}
     */
    async put(url, data, options = {}) {
        return this.request(url, {method: 'PUT', body: JSON.stringify(data), ...options})
    }

    /**
     * 发送 DELETE 请求
     * @param {string} url
     * @param {object} options
     * @returns {Promise<object>}
     * @throws {AppError}
     */
    async delete(url, options = {}) {
        return this.request(url, {method: 'DELETE', ...options})
    }
}

const http = new Http(CONFIG.apiBaseUrl)
export {
    http
}