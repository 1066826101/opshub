export interface User {
    id: number
    userName: string
    password: string
    name: string
    phone: string
    role: 'admin' | 'operator' | 'auditor' | 'guest'
    status: 0 | 1
    lastLogin: string
}
