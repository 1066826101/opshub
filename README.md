# OpsHub · 内容运营管理平台

一个基于 **Vue 3 + TypeScript** 的内容运营后台，用于实践权限体系、动态表单引擎、数据可视化等
中后台典型场景。

> 🚧 开发中，当前完成度约 60%

---

## 技术栈

| 分类 | 选型 |
|---|---|
| 框架 | Vue 3.5（`<script setup>`）+ TypeScript 6 |
| 构建 | Vite 8（Rolldown） |
| 状态管理 | Pinia |
| 路由 | Vue Router 5 |
| UI 组件 | Element Plus |
| 图表 | ECharts |
| 代码规范 | ESLint 10（flat config）+ vue-tsc |

---

## 功能进度

- [x] **布局**：可拖拽侧栏（宽度持久化）、递归菜单、头部 / 底部
- [x] **多页签**：打开 / 切换 / 关闭，与路由完全联动，至少保留一个
- [x] **登录**：表单校验、token 持久化、接口联调通过
- [ ] **路由守卫**：未登录拦截、登录后重定向
- [ ] **权限体系**：RBAC 动态路由 + 按钮级权限
- [ ] **内容管理**：列表 / 筛选 / 分页 / CRUD
- [ ] **动态表单**：Schema 驱动的表单引擎
- [ ] **工作台**：ECharts 数据看板

---

## 技术要点

### 零依赖 Mock

用 Vite 的 `configureServer` 中间件实现 `/api/*` 拦截，不引入 `mockjs` / `vite-plugin-mock`。
好处：热更新即时生效、支持任意 HTTP 方法、不增加依赖体积。

### 多页签由路由单向驱动

标签列表从 `route.fullPath` 单向推导，菜单点击和标签点击都只负责 `router.push`。
避免"标签高亮和实际页面不一致"这类经典问题。

### 请求层类型收敛

`request<T>(config): Promise<T>` 统一处理 `ApiResult` 信封，业务代码只接触业务数据类型，
不需要每次判断 `code`。

---

## 快速开始

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # 类型检查 + 构建
pnpm lint
```

### 演示账号

三种角色看到不同的菜单：

| 账号 | 密码 | 角色 |
|---|---|---|
| `admin` | `123456` | 超级管理员，全部权限 |
| `operator` | `123456` | 运营，不能审核 |
| `auditor` | `123456` | 审核员，只能审核 |

---

## 目录结构

```
├── docs/                   需求文档、设计原型
├── mock/                   零依赖 Mock 服务（Vite 中间件）
│   ├── index.ts            Mock 插件
│   ├── routes.ts           接口定义
│   └── data.ts             假数据
├── src/
│   ├── api/                请求层
│   │   ├── request.ts      axios 实例 + 拦截器
│   │   └── user/           用户相关接口
│   ├── components/         全局组件
│   ├── constants/          常量
│   ├── layouts/            布局 / 菜单 / 多页签
│   ├── router/             路由配置
│   ├── stores/             Pinia
│   ├── style/              全局样式
│   ├── types/              全局类型
│   └── views/              页面
└── vite.config.ts
```

---

## 相关文档

- [需求文档](docs/需求文档.md)
- [设计原型](docs/设计原型.html) — 浏览器直接打开
