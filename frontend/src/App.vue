<script setup>
</script>

<template>
    <Suspense>
        <template #default>
            <RouterView/>
        </template>
        <template #fallback>
            <!-- 加载中状态 -->
            <div>Loading...</div>
        </template>
    </Suspense>
</template>

<style scoped></style>
