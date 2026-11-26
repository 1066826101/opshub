# OpsHub 项目 · 问题总结

> 项目：Vue 3 + TypeScript 内容运营管理平台（面试作品集）
> 路径：`D:\代码\opshub`
> 总结时间：2026-11-26
> 用途：记录踩过的坑 → 反推 TS 学习重点

---

## 一、项目现状

| 模块 | 完成度 | 说明 |
|---|---|---|
| 工程配置 | ✅ 100% | Vite 8 + Vue 3.5 + TS 6 + ESLint 10 + Pinia + Router 5 |
| Mock 服务 | ✅ 100% | 零依赖 Vite 中间件，6 个接口 |
| 路由 | 🟡 90% | 3 布局 + 6 页面 + 404，守卫待改（游客模式） |
| 布局 | ✅ 90% | 可拖拽侧栏 + 宽度记忆 + 头尾 |
| 菜单 | ✅ 85% | 递归组件 + 图标 + 高亮跟随路由 |
| 多页签 | 🟡 80% | 增删切换可用，`onMounted` 待改 `watch` |
| 登录 | ✅ 85% | 表单校验 + 接口联调通过 |
| 请求层 | ✅ 90% | axios 封装 + 类型收敛 |
| **权限体系** | ❌ 0% | 未开始 |
| 内容管理 | ❌ 5% | 占位页 |
| 动态表单 | ❌ 0% | 未开始 |
| 工作台图表 | ❌ 5% | 占位页 |

**代码状态：** `vue-tsc` / `tsc` / `eslint` 三项全绿 ✅

---

## 二、踩过的坑（按类型，共 33 个）

### A. 工程配置（8 个）

| 现象 | 原因 | 解法 |
|---|---|---|
| `TS2834 相对导入需要扩展名` | `tsconfig.node.json` 用 `nodenext` | 改 `moduleResolution: "bundler"` |
| Vite 8 报 `configLoader: native` 不支持目录 index | Rolldown 接管后走 Node ESM 规则 | 导入显式写 `.ts` |
| `esbuild.drop` 类型不存在 | Vite 8 不再依赖 esbuild | 改用 `terser` + `drop_console` |
| `nodeLinker=hoisted` 不生效 | pnpm 12 只读 `pnpm-workspace.yaml` | 写进那里，不是 `.npmrc` |
| `ESLintIgnoreWarning` | ESLint 10 移除了 `.eslintignore` | 用 `eslint.config.js` 的 `ignores` |
| `TS5101 baseUrl 已弃用` | TS 6 起废弃 | 删掉 `baseUrl`，`paths` 相对 tsconfig 解析 |
| IDE 报错但命令行通过 | Volar / IDEA 缓存了旧 tsconfig | 以 `pnpm build` 退出码为准 |
| `request<unknown, T>` 报类型错 | axios 1.20 改成条件类型 `AxiosResponseResult` | 只传第一个泛型 `<ApiResult<T>>` |

### B. Vue 响应式（10 个）—— 重灾区

| 现象 | 原因 | 解法 |
|---|---|---|
| store 里 `menuArr` 永远是空数组 | `let menuArr = ref([])` + `menuArr = ref(...)` 断链 | `ref` + `.value`，或 `reactive` + `splice` |
| `computed` 不更新 | `computed(() => user)` 里 `user` 是 `let` 变量，读取不算依赖 | `computed(() => user.value)` |
| `isLogin` 登录后不变 | `computed` 读 `localStorage`（非响应式） | 改成依赖 `user` ref |
| `watch(route.fullPath)` 不生效 | 传的是「值」，不是「getter」 | `watch(() => route.fullPath)` |
| `watch` 加了 `immediate` 还失效 | 无效源被当成空函数，只跑一次且值是 `undefined` | 同上 |
| `reactive` 被整体替换 | 变量指向新对象，旧引用卡住（**不是"丢失响应性"**） | `Object.assign` / `splice` / 改 `.value` |
| `reactive(null)` 不是响应式 | `reactive` 只接受对象 | 可空值用 `ref` |
| `splice` 之后用原索引 | 数组已移位 | 删之前先存 `wasActive` |
| `key` 用 index | 列表增删时 DOM 就地复用 → 内部状态错位 | 用数据自带 id |
| `onMounted` 跨路由不重新执行 | Layout 组件被复用 | 用 `watch(route)` |

### C. 类型（5 个）

| 现象 | 原因 | 解法 |
|---|---|---|
| `ref(null)` 后 `.value?.xxx` 是 `never` | `Ref<null>` | `ref<FormInstance>()` |
| `setUser()` 报 `Expected 1 arguments` | `(x: T \| undefined)` **必传**（只是允许 undefined） | `(x?: T)` |
| `to.name` 不能传给 `includes` | 类型是 `string \| symbol \| undefined` | `typeof to.name === 'string'` 先收窄 |
| `as never` 为什么要写 | axios 拦截器解包破坏了返回类型契约 | 把解包挪到 `request<T>` 里 |
| 存整个 `RouteLocationNormalizedLoaded` | `matched` 里是组件定义 → 循环引用 | 只存 `{ path, query, hash }` |

### D. 路由（4 个）

| 现象 | 原因 | 解法 |
|---|---|---|
| 白屏、控制台报错 | 两个路由 `name` 重复，**vue-router 5 直接抛错**（v4 只 warn） | 唯一 name |
| `params` 静默失效 | `router.push({ path, params })` 里 params 被丢弃 | 必须用 `name` |
| 值类型不对 | `params` / `query` 取出来是 **string** | 显式 `Number()` |
| push 后立刻读 `route` 是旧值 | `router.push` 是异步的 | `await` 或 `watch(route)` |

### E. CSS（5 个）

| 现象 | 原因 | 解法 |
|---|---|---|
| `<style scoped>` 改不了子组件内部元素 | Vue 给不到子组件内部 DOM 加 `data-v` | `:deep()` |
| `/deep/` 报废弃警告 | Vue 3 已废弃（原 CSS 提案被删） | `:deep()` |
| `scrollIntoView` 没法设偏移 | 它没有 `offset` 参数 | 元素加 `scroll-margin-top` |
| 表头文字不换行 | Element 默认 `.cell { white-space: nowrap }` | 覆盖成 `normal` |
| 固定列的表头没变 | 固定列的表头是独立复制的一份 DOM | 加 `.el-table__fixed-header-wrapper` 选择器 |

### F. 业务逻辑（5 个）

| 现象 | 原因 | 解法 |
|---|---|---|
| 登录一直 500 | 前端传 `userName`，mock 读 `username` | 全项目统一大小写 |
| `"" <= 3` 是 `true`、`"" * 2` 是 `0` | 空字符串隐式转换 | `Number()` + `Number.isFinite()` |
| 删除标签跳错页 | 先 `splice` 再判断 `isCheck` | 删之前存下来 |
| `el-menu` 高亮不跟随 | `index` 要 string，`default-active` 有 `watch` | `String(item.index)` |
| 退出登录后菜单还是旧的 | 菜单没跟着角色重拉 | store 里存 `menuRole` 比对 |

---

## 三、从 33 个坑里提炼的 8 条认知

### ① `ref` 是盒子，`reactive` 是对象本身

```
换盒子里的东西（.value）      → 全世界都能看到
换对象（reactive 重新赋值）   → 只有你自己知道，别人卡在旧对象上
```

**结论：集合用 `ref` + `.value`，对象用 `reactive` + `Object.assign`。**

### ② 响应式 = 「属性读取」，不是「变量赋值」

```ts
let a = 1
const c = computed(() => a)          // ❌ 永远不更新
a = 2

const a = ref(1)
const c = computed(() => a.value)    // ✅
a.value = 2
```

`computed` / `watch` / 模板，都只能追踪「读到了哪个响应式属性」。

### ③ `?` 是"可以不传"，`| undefined` 是"必须传"

```ts
function f(x?: T)              // f() ✅
function f(x: T | undefined)   // f() ❌ TS2554
```

### ④ TS 的类型是「声明」，不是「保证」

```ts
interface ApiResult<T> { code: number; data: T }
```

这只说明「你希望后端这样返回」。后端真返回 `{ msg: '...' }` 时 TS 不会救你 ——
运行时校验（zod / 手动判断）才是防线。

### ⑤ `as` 是逃生舱，出现 `as never` 说明设计有问题

拦截器里 `return body.data as never` 本质是「骗编译器」。
正确做法是让返回值类型和运行时一致，而不是加 `as`。

### ⑥ IDE 的红线 ≠ 代码有错

Volar 缓存、`strict` 过严、库类型不全，都会造成假报错。

**唯一权威：**

```powershell
pnpm build
```

### ⑦ 类型报错 90% 是「你以为的类型」和「实际类型」不一致

**最快的学法：在 IDE 里 hover 变量，看 TS 认为它是什么。**

33 个坑里至少 15 个，hover 一下就能发现。

### ⑧ 库升级会让教程失效 —— 看源码比搜博客准

| 踩的坑 | 网上的教程 |
|---|---|
| `esbuild.drop` 类型不存在 | 遍地 Vite 5/6/7 教程 |
| `axios <unknown, T>` 报错 | 所有 axios 封装文章都是老写法 |
| `/deep/` 被废弃 | Vue 2 时代教程 |
| `.eslintignore` 移除 | ESLint 8 时代 |

**遇到「按教程配了但报错」，第一步永远是查类型定义：**

```powershell
Select-String -Path "node_modules\xxx\dist\index.d.ts" -Pattern "你要找的 API"
```

---

## 四、TS 学习清单（按踩过的坑定制）

### 第一层：必须搞懂（踩最多的）

- [ ] `ref` vs `reactive` 的区别 + 各自适用场景
- [ ] `.value` 什么时候要、什么时候不要（Pinia 会自动 unwrap）
- [ ] 解构为什么会丢响应性 → `storeToRefs`
- [ ] `computed` 的「依赖」到底是什么
- [ ] `watch` 的第一个参数：值 vs getter vs ref
- [ ] 可选参数 `?` vs `| undefined`
- [ ] `ref<T>()` 的空值类型 `Ref<T | undefined>`

**这 7 条搞懂，本次的坑能消灭 80%。**

### 第二层：写业务必备

- [ ] `interface` vs `type`
- [ ] `Omit` / `Partial` / `Pick`（复用已有类型）
- [ ] 泛型基础：`<T>`、`Promise<T>`
- [ ] 类型收窄：`typeof` / `in` / 字面量联合
- [ ] `unknown` vs `any` vs `never`
- [ ] 函数重载（了解即可）

### 第三层：暂时不用学（面试会提，项目用不到）

- [ ] 条件类型（`T extends U ? X : Y`）
- [ ] `infer`
- [ ] 映射类型（`{ [K in keyof T]: ... }`）
- [ ] 模板字面量类型

> **别一上来就啃第三层。本次 33 个坑，没有一个需要条件类型。**

---

## 五、怎么学最快

### ① 用自己的项目当教材

```powershell
cd D:\代码\opshub
# 每次看到报错，先 hover 看类型，再动手改
```

已经有 33 个真实案例，比任何教程都值钱。

### ② 建立「报错 → 类型认知」的映射

遇到报错先问三个问题：

1. TS 认为这个变量是什么类型？（hover）
2. 我以为是什么类型？
3. **为什么会不一样？**

比「背 API」有效 10 倍。

### ③ 学响应式别只看 API

```
ref/reactive 的实现（看 30 行就够）
   ↓
为什么 reactive 要 Proxy、ref 要用 .value
   ↓
依赖收集的触发时机（getter）
   ↓
再看 computed / watch 的行为就都懂了
```

### ④ 把踩过的坑写成单测

```ts
// __tests__/reactivity.spec.ts
it('reactive 整体替换会断开引用', () => {
  let s = reactive({ a: 1 })
  const saved = s
  s = reactive({ a: 2 })
  expect(saved.a).toBe(1)   // 亲手验证一次，永远记住
})
```

---

## 六、下次回来先做这 4 件事

按顺序，都是方案已给、只差实施的：

| # | 事项 | 位置 | 说明 |
|---|---|---|---|
| 1 | 守卫改成「角色驱动菜单」 | `guard.ts` + `menu.ts` | 加 `menuRole`，`role !== menuRole` 就重拉 |
| 2 | `isLogin` 改响应式 + `user` 初始化恢复 | `user.ts` | `computed(() => user.value !== null)` |
| 3 | `onMounted` 改 `watch(route)` | `layouts/index.vue` | 多页签才会跟随路由 |
| 4 | 退出登录补 `router.push('/login')` | `viewHead.vue` | — |

**这 4 处改完，「游客浏览 → 登录 → 菜单变全 → 退出 → 菜单变回」就闭环了。**

### 参考代码：守卫（游客模式）

```ts
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user.ts'
import { menuStore } from '@/stores/modules/menu.ts'

/**
 * 注册全局路由守卫。
 * 本站为游客模式：未登录也能浏览，菜单按 guest 角色下发。
 */
export function setupRouterGuard(router: Router) {
    router.beforeEach(async (to) => {
        const userStore = useUserStore()
        const menuS = menuStore()

        // 已登录还去登录页 → 回首页
        if (userStore.isLogin && to.name === 'Login') {
            return { path: '/workbench' }
        }

        // 角色变了（首次进入 / 登录 / 退出）→ 重拉菜单
        const role = userStore.user?.role ?? 'guest'
        if (menuS.menuRole !== role) {
            await menuS.getMenu()
        }

        return true
    })
}
```

### 参考代码：user store

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { User } from '@/types/user.ts'

/** 从 localStorage 读取用户，容错脏数据 */
function readUser(): User | null {
    try {
        const raw = localStorage.getItem('user')
        return raw ? (JSON.parse(raw) as User) : null
    } catch {
        return null
    }
}

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(readUser())
    const isLogin = computed(() => user.value !== null)

    const setUser = (userParams?: User) => {
        if (userParams) {
            user.value = userParams
            localStorage.setItem('user', JSON.stringify(userParams))
        } else {
            user.value = readUser()
        }
    }

    const loginOut = () => {
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return { user, isLogin, setUser, loginOut }
})
```

---

## 附：进度对照

```
3 周前：Vue 2 + JS，没碰过 TS
现在：  能独立搭一个 Vue3 + TS 的完整后台骨架，类型全绿
```

**项目本身只完成约 60%，但踩过的 33 个坑是实打实的能力 —— 那才是最值钱的部分。**

TS 第二遍学的时候，重点不是看更多语法，而是回头把这些坑逐个用类型知识解释一遍。

---

## 变更记录

| 日期 | 内容 |
|---|---|
| 2026-11-26 | 初版：项目现状 + 33 个坑 + 8 条认知 + TS 学习清单 |
