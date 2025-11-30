import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Tracking from '../views/Tracking.vue'
import Stok from '../views/Stok.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/tracking',
        name: 'Tracking',
        component: Tracking,
        meta: { requiresAuth: true }
    },
    {
        path: '/stok',
        name: 'Stok',
        component: Stok,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
    const currentUser = localStorage.getItem('currentUser')

    if (to.meta.requiresAuth && !currentUser) {
        next({ name: 'Login' })
    } else if (to.name === 'Login' && currentUser) {
        next({ name: 'Dashboard' })
    } else {
        next()
    }
})

export default router

