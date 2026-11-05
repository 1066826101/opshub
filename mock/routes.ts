import type { IncomingHttpHeaders } from 'node:http'
import { users, contents, menusByRole } from './data.ts'

export interface MockContext {
    /** 路径参数，如 /users/:id 里的 id */
    params: Record<string, string>
    /** 查询参数 */
    query: Record<string, string>
    /** 请求体（已 JSON.parse） */
    body: unknown
    /** 请求头 */
    headers: IncomingHttpHeaders
}

export interface MockRoute {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    /** 延迟毫秒，默认 300 */
    delay?: number
    handler: (ctx: MockContext) => unknown | Promise<unknown>
}

/** 简单的分页工具 */
function paginate<T>(list: T[], page: string, pageSize: string) {
    const p = Number(page) || 1
    const size = Number(pageSize) || 10
    return {
        list: list.slice((p - 1) * size, p * size),
        total: list.length,
        page: p,
        pageSize: size,
    }
}

export const mockRoutes: MockRoute[] = [
    // ---------------- 认证 ----------------
    {
        method: 'POST',
        path: '/api/auth/login',
        delay: 500,
        handler: ({ body }) => {
            const { userName, password } = body as { userName: string; password: string }
            const user = users.find(u => u.userName === userName && u.password === password)
            if (!user) throw new Error('账号或密码错误')

            return {
                token: `mock-token-${user.userName}-${Date.now()}`,
                profile: {
                    id: user.id,
                    userName: user.userName,
                    name: user.name,
                    role: user.role,
                    avatar: '',
                },
            }
        },
    },
    {
        method: 'GET',
        path: '/api/auth/menus',
        handler: ({ query }) => {
            const role = query.role ?? 'operator'
            return menusByRole[role] ?? []
        },
    },

    // ---------------- 用户列表 ----------------
    {
        method: 'GET',
        path: '/api/users',
        handler: ({ query }) => {
            let list = [...users]

            if (query.keyword) {
                const kw = query.keyword.toLowerCase()
                list = list.filter(u =>
                    u.userName.toLowerCase().includes(kw) ||
                    u.name.includes(query.keyword),
                )
            }
            if (query.role) list = list.filter(u => u.role === query.role)

            const { list: pageList, total, page, pageSize } =
                paginate(list, query.page, query.pageSize)

            // 不把密码返回给前端
            return {
                list: pageList.map(({ password: _pw, ...rest }) => rest),
                total,
                page,
                pageSize,
            }
        },
    },
    {
        method: 'DELETE',
        path: '/api/users/:id',
        handler: ({ params }) => {
            const idx = users.findIndex(u => String(u.id) === params.id)
            if (idx === -1) throw new Error('用户不存在')
            users.splice(idx, 1)
            return { id: params.id }
        },
    },

    // ---------------- 内容列表 ----------------
    {
        method: 'GET',
        path: '/api/contents',
        handler: ({ query }) => {
            let list = [...contents]
            if (query.status) list = list.filter(c => c.status === query.status)
            if (query.keyword) {
                list = list.filter(c => c.title.includes(query.keyword))
            }
            return paginate(list, query.page, query.pageSize)
        },
    },
]
