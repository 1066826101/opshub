import { createWebHistory, createRouter } from 'vue-router'
import { routes } from './routes.ts'
import { setupRouterGuard } from './guard.ts'

const router = createRouter({
    history: createWebHistory(),
    routes
})

setupRouterGuard(router)

export default router
