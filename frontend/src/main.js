import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {appRouter} from "@/utils/router.js";

const app = createApp(App)

appRouter.initRouter(router)
app.use(router)

app.mount('#app')
