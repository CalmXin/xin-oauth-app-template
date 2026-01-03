const env = import.meta.env

const appConfig = {
    // 前端应用配置
    appName: env.VITE_APP_NAME,
    appAuthor: env.VITE_APP_AUTHOR,
    appUrl: env.VITE_APP_URL,

    // 后端接口地址
    apiBaseUrl: env.VITE_API_BASE_URL,
}

export default appConfig