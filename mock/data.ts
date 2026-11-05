export interface MockUser {
    id: number
    userName: string
    password: string
    name: string
    phone: string
    role: 'admin' | 'operator' | 'auditor' | 'guest'
    status: 0 | 1
    lastLogin: string
}

const roles: MockUser['role'][] = ['admin', 'operator', 'auditor', 'guest']

export const users: MockUser[] = Array.from({ length: 60 }, (_, i) => {
    const n = i + 1
    return {
        id: n,
        userName: n <= 3 ? ['admin', 'operator', 'auditor'][n - 1]! : `user${n}`,
        password: '123456',
        name: `用户${n}`,
        phone: `138****${String(1000 + n).slice(-4)}`,
        role: n <= 3 ? (['admin', 'operator', 'auditor'] as const)[n - 1]! : roles[n % 4]!,
        status: n % 7 === 0 ? 0 : 1,
        lastLogin: new Date(Date.now() - n * 3600_000).toISOString(),
    }
})

export interface MockContent {
    id: number
    title: string
    category: 'article' | 'video' | 'topic'
    status: 'draft' | 'pending' | 'published' | 'rejected'
    author: string
    createdAt: string
}

const statuses: MockContent['status'][] = ['draft', 'pending', 'published', 'rejected']

export const contents: MockContent[] = Array.from({ length: 50 }, (_, i) => {
    const n = i + 1
    return {
        id: n,
        title: `【内容】第 ${n} 篇运营稿件`,
        category: (['article', 'video', 'topic'] as const)[n % 3]!,
        status: statuses[n % 4]!,
        author: `用户${(n % 5) + 1}`,
        createdAt: new Date(Date.now() - n * 7_200_000).toISOString(),
    }
})

export const menusByRole: Record<string, unknown[]> = {
    admin: [
        { path: '/dashboard', title: '工作台', icon: 'HomeFilled' },
        { path: '/content', title: '内容管理', icon: 'Document' },
        { path: '/audit', title: '审核中心', icon: 'Checked' },
        { path: '/system/users', title: '用户管理', icon: 'User' },
        { path: '/system/roles', title: '角色权限', icon: 'Lock' },
    ],
    operator: [
        { path: '/dashboard', title: '工作台', icon: 'HomeFilled' },
        { path: '/content', title: '内容管理', icon: 'Document' },
    ],
    auditor: [
        { path: '/dashboard', title: '工作台', icon: 'HomeFilled' },
        { path: '/audit', title: '审核中心', icon: 'Checked' },
    ],
    guest: [
        { path: '/dashboard', title: '工作台', icon: 'HomeFilled' },
    ],
}
