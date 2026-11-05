export const routes = [
    {
        path: '/',
        component: () => import('@/layouts/index.vue'),
        redirect: 'workbench',
        children: [
            {
                path: 'workbench',
                name: 'Workbench',
                component: () => import('@/views/workbench/index.vue')
            }
        ]
    },
    {
        path: '/contain',
        component: () => import('@/layouts/index.vue'),
        children: [
            {
                path: 'management',
                name: 'ContainManagement',
                component: () => import('@/views/contain/management/index.vue')
            },
            {
                path: 'audit',
                name: 'Audit',
                component: () => import('@/views/contain/audit/index.vue')
            },
            {
                path: 'myForm',
                name: 'MyForm',
                component: () => import('@/views/contain/myForm/index.vue')
            }
        ]
    },
    {
        path: '/user',
        component: () => import('@/layouts/index.vue'),
        children: [
            {
                path: 'management',
                name: 'UserManagement',
                component: () => import('@/views/user/management/index.vue')
            },
            {
                path: 'role',
                name: 'Role',
                component: () => import('@/views/user/role/index.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue')
    }
]
