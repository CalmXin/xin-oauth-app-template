<template>
    <div style="font-size: 25px">Redirecting to the login page...</div>
</template>

<script setup>

import {appRouter} from "@/utils/router.js";
import appConfig from "@/config.js";

appRouter.redirect(`${appConfig.apiBaseUrl}/auth/login`)
</script>

<style scoped>

</style>