import { defineStore  } from 'pinia'
import { ref, computed } from 'vue'

import type { User } from '@/types/user.ts'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)

    const userComputed = computed(() => user.value)

    return {
        user: userComputed
    }
})
