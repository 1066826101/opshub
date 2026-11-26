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
        { index: '1', path: '/workbench', title: '工作台', icon: 'HomeFilled' },
        {
            index: '2',
            title: '内容运营',
            icon: 'Histogram',
            children: [
                {
                    index: '3',
                    title: '内容管理',
                    icon: 'Comment',
                    path: '/contain/management'
                },
                {
                    index: '4',
                    title: '审核管理',
                    icon: 'QuestionFilled',
                    path: '/contain/audit'
                }
            ]
        },
        {
            index: '5',
            title: '系统管理',
            icon: 'Tools',
            children: [
                {
                    index: '6',
                    title: '用户管理',
                    icon: 'Avatar',
                    path: '/user/management'
                },
                {
                    index: '7',
                    title: '角色管理',
                    icon: 'Avatar',
                    path: '/user/role'
                }
            ]
        }
    ],
    operator: [
        { index: '8', path: '/workbench', title: '工作台', icon: 'HomeFilled' },
        {
            index: '9',
            title: '内容运营',
            icon: 'Histogram',
            children: [
                {
                    index: '10',
                    title: '内容管理',
                    icon: 'Comment',
                    path: '/contain/management'
                }
            ]
        },
    ],
    auditor: [
        { index: '11', path: '/workbench', title: '工作台', icon: 'HomeFilled' },
        {
            index: '12',
            title: '内容运营',
            icon: 'Histogram',
            children: [
                {
                    index: '13',
                    title: '审核管理',
                    icon: 'QuestionFilled',
                    path: '/contain/audit'
                }
            ]
        },
    ],
    guest: [
        { index: '14', path: '/workbench', title: '工作台', icon: 'HomeFilled' }
    ]
}
