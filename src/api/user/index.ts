import request from '@/api/request.ts'
import type { User } from '@/types/user.ts'
import type { ApiResult } from '@/types/http.ts'
import type { MenuItemProp } from '@/types/menuItem.ts'

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

/** 菜单返回体 */
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

export interface menusParams {
    role: string
}

export const menus = (params: menusParams) => {
    return request<ApiResult<MenuItemProp[]>>({
        url: '/api/auth/menus',
        method: 'get',
        params
    })
}
