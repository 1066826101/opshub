export interface ApiResult<T> {
    code: number,
    message: string,
    data: T
}

/** 分页结果 */
export interface PageResult<T> {
    list: T[]
    total: number
    page: number
    pageSize: number
}

/** 分页查询参数 */
export interface PageQuery {
    page?: number
    pageSize?: number
}
