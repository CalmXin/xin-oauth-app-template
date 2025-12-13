<template>

</template>

<script setup>

import {appRouter} from "@/utils/router.js";
import CONFIG from "@/config.js";

appRouter.redirect(`${CONFIG.apiBaseUrl}/auth/login`)
</script>

<style scoped>

</style>