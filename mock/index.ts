import type { Plugin } from 'vite'
import type { IncomingMessage } from 'node:http'
import { mockRoutes } from './routes.ts'

/** Mock 总开关：接入真实后端时改成 false */
const ENABLED = true

/** 读取请求体并尝试 JSON 解析 */
async function readBody(req: IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = []
    for await (const chunk of req) chunks.push(chunk as Buffer)
    const raw = Buffer.concat(chunks).toString('utf-8')
    if (!raw) return undefined
    try {
        return JSON.parse(raw)
    } catch {
        return raw
    }
}

/** 解析 URL 查询参数 */
function parseQuery(url: string): Record<string, string> {
    const qs = url.split('?')[1] ?? ''
    const out: Record<string, string> = {}
    for (const pair of qs.split('&')) {
        if (!pair) continue
        const idx = pair.indexOf('=')
        const k = idx === -1 ? pair : pair.slice(0, idx)
        const v = idx === -1 ? '' : pair.slice(idx + 1)
        out[decodeURIComponent(k)] = decodeURIComponent(v)
    }
    return out
}

/** 匹配 /users/:id 这类路径，返回动态参数 */
function matchPath(pattern: string, path: string): Record<string, string> | null {
    const p = pattern.split('/')
    const a = path.split('/')
    if (p.length !== a.length) return null

    const params: Record<string, string> = {}
    for (let i = 0; i < p.length; i++) {
        if (p[i].startsWith(':')) {
            params[p[i].slice(1)] = a[i]
        } else if (p[i] !== a[i]) {
            return null
        }
    }
    return params
}

/**
 * 本地 Mock 插件。
 * 拦截 /api 开头的请求，命中路由表就返回假数据，未命中交给下一个中间件。
 */
export function mockPlugin(): Plugin {
    return {
        name: 'local-mock',
        apply: 'serve',          // 只在 dev server 生效，build 时不存在

        configureServer(server) {
            if (!ENABLED) return

            // ⚠️ 直接 use 会安装在 Vite 内部中间件【之前】，
            //    所以 mock 优先于 server.proxy 生效
            server.middlewares.use(async (req, res, next) => {
                const url = req.url ?? ''
                if (!url.startsWith('/api')) return next()

                const path = url.split('?')[0]
                const method = (req.method ?? 'GET').toUpperCase()

                let matched: (typeof mockRoutes)[number] | undefined
                let params: Record<string, string> = {}

                for (const route of mockRoutes) {
                    if (route.method !== method) continue
                    const m = matchPath(route.path, path)
                    if (m) {
                        matched = route
                        params = m
                        break
                    }
                }

                if (!matched) {
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'application/json; charset=utf-8')
                    res.end(JSON.stringify({ code: 404, message: `Mock 未定义: ${method} ${path}` }))
                    return
                }

                // 模拟网络延迟
                await new Promise(r => setTimeout(r, matched!.delay ?? 300))

                try {
                    const data = await matched.handler({
                        params,
                        query: parseQuery(url),
                        body: await readBody(req),
                        headers: req.headers,
                    })
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json; charset=utf-8')
                    res.end(JSON.stringify({ code: 200, message: 'ok', data }))
                } catch (err) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json; charset=utf-8')
                    res.end(JSON.stringify({
                        code: 500,
                        message: err instanceof Error ? err.message : String(err),
                    }))
                }
            })
        },
    }
}
