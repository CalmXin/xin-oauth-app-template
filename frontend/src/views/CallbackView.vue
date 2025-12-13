<template>
</template>

<script setup>
import {appRouter} from "@/utils/router.js";
import {http} from "@/utils/http.js";
import {appStore} from "@/utils/storage.js";
import {createLogger} from "@/utils/logger.js";

const logger = createLogger('CallbackView')
const code = appRouter.getQuery('code')
const state = appRouter.getQuery('state')

try {
    const {access_token, user} = await http.get('/auth/callback', {code, state})
    appStore.set('access_token', access_token)
    appStore.set('user', user)
    logger.info('登录成功', user)
} catch (e) {
    logger.error(e.toObject())
}
</script>

<style scoped>

</style>