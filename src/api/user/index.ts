import request from '@/api/request.ts'
import type { User } from '@/types/user.ts'
import type { ApiResult } from '@/types/http.ts'

/** 登录请求体 */
export interface LoginParams {
    userName: string
    password: string
}

/** 登录返回体 */
export interface LoginResult {
    token: string
    profile: User
}

export const login = (data: LoginParams) => {
    return request<ApiResult<LoginResult>>({
        url: '/api/auth/login',
        method: 'post',
        data
    })
}
