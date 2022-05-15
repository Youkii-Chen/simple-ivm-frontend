import { createRouter, createWebHistory} from 'vue-router'
import { store } from '../store'


const routeRules = [
    { path: '/login', component: () => import('../views/pageLogin.vue')},
    { path: '/goods', component: () => import('../views/pageGoodsList/index.vue') },
]

export const router = createRouter({
    history: createWebHistory('/ui'),
    routes: routeRules
})

router.beforeEach((to, from) => {
    if (store.state.isLogined && from.path === '/login'){
        // 防止重复登录
        return false
    }if (!store.state.isLogined && to.path === '/login'){
        // 未登录允许登录
        return true
    }if (!store.state.isLogined && !store.state.debug) {
        // 未登录而且未在debug中, 强制转跳登录
        router.replace('/login')
        return false
    }

    return true;
    
})