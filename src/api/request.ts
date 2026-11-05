import { create } from 'axios'
import type { AxiosRequestConfig } from 'axios'
const instance = create({
    baseURL: '/',
    timeout: 1000
})

instance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 *
 * @param config axios 请求配置
 * @returns 响应体
 */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await instance.request<T>(config)
    return response.data
}

export default request
