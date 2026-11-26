import { defineStore  } from 'pinia'
import {computed, ref} from 'vue'

import type { User } from '@/types/user.ts'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)

    const setUser = (userParams?: User) => {
        const userString = localStorage.getItem('user')
        if(userParams) {
            user.value = userParams
            localStorage.setItem('user', JSON.stringify(userParams))
        } else {
            if(userString) {
                user.value = JSON.parse(userString) || null
            }
        }
    }

    const isLogin = computed(() => {
        const userString = localStorage.getItem('user')
        if(!userString) {
            return false
        }
        const user = JSON.parse(userString)
        return !!user
    })

    const loginOut = () => {
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return {
        user: user,
        setUser: setUser,
        isLogin: isLogin,
        loginOut: loginOut
    }
})
