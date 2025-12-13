<template>
    <div style="font-size: 25px">Wait a moment...</div>
</template>

<script setup>
import {appRouter} from "@/utils/router.js";
import {http} from "@/utils/http.js";
import {appStore} from "@/utils/storage.js";
import {createLogger} from "@/utils/logger.js";
import {onMounted} from "vue";

const logger = createLogger('CallbackView')
const code = appRouter.getQuery('code')
const state = appRouter.getQuery('state')

onMounted(async () => {
    try {
        const {access_token, user} = await http.get('/auth/callback', {code, state})
        appStore.set('access_token', access_token)
        appStore.set('user', user)
        logger.info('登录成功', user)

        if (appStore.has('current_path')) {
            const currentPath = appStore.get('current_path')
            appStore.remove('current_path')
            await appRouter.replace(currentPath)
        } else {
            await appRouter.replace('/')
        }

    } catch (e) {
        logger.error(e.toObject())
    }
})

</script>

<style scoped>

</style>