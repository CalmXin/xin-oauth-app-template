import {createRouter, createWebHistory} from 'vue-router'
import {appStorage} from "@/utils/storage.js";
import {logger} from "@/utils/logger.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue'),
            meta: {
                requiresAuth: false,
                guestOnly: false,
            },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/LoginView.vue'),
            meta: {
                requiresAuth: false, // 是否需要登录
                guestOnly: true, // 是否 guest
            },
        },
        {
            path: '/callback',
            name: 'callback',
            component: () => import('@/views/CallbackView.vue'),
            meta: {
                requiresAuth: false,
                guestOnly: true,
            },
        },

        // 404 页面，放到末尾
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFoundView.vue'),
            meta: {
                requiresAuth: false,
                guestOnly: false,
            },
        },
    ],
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !appStorage.has('access_token')) {
        appStorage.set('current_path', to.fullPath)
        next({name: 'login'})
    } else if (to.meta.guestOnly && appStorage.has('access_token')) {
        next({name: 'home'})
    } else {
        next()
    }
})

export default router
