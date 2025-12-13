import {logger} from "@/utils/logger.js";
import {Router, RouteLocationNormalized, RouteParamsGeneric} from 'vue-router'

class AppRouter {
    constructor() {
        /** @type {Router} */
        this._router = null;
        /** @type {RouteLocationNormalized} */
        this._route = null;
    }

    /**
     * 初始化路由实例
     * @param {Router} routerInstance
     */
    initRouter(routerInstance) {
        this._router = routerInstance
        this._route = routerInstance.currentRoute.value

        routerInstance.afterEach(
            (to) => {
                this._route = to
            }
        )

        logger.info('路由实例初始化成功')
    }

    /**
     * 获取路由参数
     * @param {string} key
     * @returns {string | null}
     */
    getParam(key) {
        return this._route?.params?.[key] ?? null
    }

    /**
     * 获取路由参数
     * @returns {RouteParamsGeneric | {}}
     */
    getParamAll() {
        return this._route?.params || {};
    }

    /**
     * 获取路由参数
     * @param {string} key
     * @returns {string | null}
     */
    getQuery(key) {
        return this._route?.query?.[key] ?? null;
    }

    /**
     * 获取路由参数
     * @returns {RouteParamsGeneric | {}}
     */
    getQueryAll() {
        return this._route?.query || {};
    }

    /**
     * 跳转路由
     * @param {string | object} to
     * @returns {Promise<void>}
     */
    async push(to) {
        return await this._router.push(to);
    }

    /**
     * 替换路由
     * @param {string | object} to
     * @returns {Promise<void>}
     */
    async replace(to) {
        return await this._router.replace(to);
    }

    /**
     * 前进/后退路由
     * @param {number} delta
     * @returns {void}
     */
    go(delta) {
        return this._router.go(delta);
    }

    /**
     * 获取当前路由
     * @returns {string}
     */
    currentPath() {
        return this._route?.fullPath || '';
    }
}

const appRouter = new AppRouter()
export {
    appRouter
}