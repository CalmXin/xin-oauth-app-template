import {AppError, ErrorCode} from "@/utils/error.js";
import appConfig from "@/config.js";
import {appStorage} from "@/utils/storage.js";
import {appRouter} from "@/utils/router.js";


class AppHttp {

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

        // 配置 headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        }

        if (appStorage.has('access_token')) {
            headers['Authorization'] = `Bearer ${appStorage.get('access_token')}`
        }

        const config = {
            credentials: 'include',
            headers,
            ...options,
        };

        // 设置超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(fullUrl, {
                ...config,
                signal: controller.signal,
            });

            if (response.status === 401) {
                appStorage.remove('access_token')
                appStorage.set('current_path', appRouter.currentPath())
                await appRouter.replace(`/login`)
                throw new AppError(ErrorCode.HTTP_REQUEST_FAILED, '登录已过期，请重新登录')
            }

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

const http = new AppHttp(appConfig.apiBaseUrl)
export {
    http
}