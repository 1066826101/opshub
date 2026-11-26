import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user.ts'
export function setupRouterGuard(router: Router) {
    router.beforeEach(async (to, from) => {
        console.log(to, from)
        if(['Login'].includes(String(to.name))) {
            return true
        }
        const userStore = useUserStore()
        if(userStore.isLogin) {
            userStore.setUser()
        }
        return true
    })
}
