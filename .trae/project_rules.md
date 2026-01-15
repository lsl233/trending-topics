# 项目规则

## 项目概述
基于 **Bun + Hono + TypeScript** 的 Web 应用，支持 HTML 渲染和 API 接口。

## 技术栈
- **运行时**: Bun
- **Web 框架**: Hono
- **语言**: TypeScript（严格模式）
- **JSX**: Hono JSX 运行时

## 开发命令
- 安装依赖: `bun install`
- 运行开发服务器: `bun run dev`
- 构建 CSS: `bun run build:css`
- 构建 JS: `bun run build:js`
- 构建所有: `bun run build`

---

## 目录结构

```
src/
├── index.ts              # Bun 服务器入口
├── app.ts                # Hono 应用主配置
├── routes/               # 路由层
│   ├── api/              # API 路由（返回 JSON）
│   └── pages/            # 页面路由（渲染 HTML）
├── services/             # 业务逻辑层
├── models/               # 数据模型层
├── middleware/           # 中间件
├── utils/                # 工具函数
├── types/                # TypeScript 类型定义
├── config/               # 配置文件
├── assets/               # 前端资源源文件（需编译）
│   ├── css/
│   ├── js/
│   └── images/
├── static/               # 静态资源（编译后）
│   ├── css/
│   ├── js/
│   └── images/
└── views/                # Hono JSX 视图组件
```

---

## 命名规范

### 文件命名
- **路由**: `{resource}.route.ts`（如 `user.route.ts`）
- **服务**: `{resource}.service.ts`（如 `user.service.ts`）
- **模型**: `{resource}.model.ts`（如 `user.model.ts`）
- **类型**: `{resource}.type.ts`（如 `user.type.ts`）
- **视图**: kebab-case（如 `home.tsx`）
- **CSS**: kebab-case（如 `main.css`）
- **JS/TS**: kebab-case（如 `main.ts`）

### 代码命名
- **变量/函数**: camelCase（如 `userName`、`getUserById`）
- **类/接口/类型**: PascalCase（如 `UserService`、`User`）
- **常量**: UPPER_SNAKE_CASE（如 `MAX_RETRY_COUNT`）

### 数据库命名
- **数据库字段**: snake_case（如 `user_name`）
- **TypeScript 接口**: camelCase（如 `userName`）
- 使用 `toCamelCase()` 工具函数自动转换

---

## 路径别名

配置了 `@/*` 别名指向 `./src/*` 目录。

```typescript
// ✅ 推荐
import { getDatabase } from '@/lib/db'
import { userService } from '@/services/user.service'

// ❌ 不推荐
import { getDatabase } from '../lib/db'
```

---

## 前端资源管理

### 构建流程
1. 在 `src/assets/` 编写源文件
2. 运行 `bun run build` 编译
3. 输出到 `src/static/` 目录
4. 通过 `/static/*` 路径访问

### Tailwind CSS
- 配置文件: `tailwind.config.ts`
- 扫描路径: `src/**/*.{html,tsx,ts,jsx,js}`
- 使用 `@import "tailwindcss";` 引入

### 静态文件服务
- 路由: `/static/*`
- 配置: `app.use('/static/*', serveStatic({ root: './src/static' }))`

---

## 代码规范

### TypeScript
- 启用严格模式
- 避免使用 `any` 类型
- 使用接口定义数据结构
- 明确函数返回类型

### 导入导出
- 使用 ES6 模块语法
- 优先使用命名导出
- 使用路径别名 `@/` 引用内部模块

### API 响应格式
- 成功: `{ success: true, data: any }`
- 错误: `{ success: false, error: string }`
- HTTP 状态码: 200/201/400/401/403/404/500

### 数据库字段转换
- Model 层使用 `toCamelCase()` 处理查询结果
- 自动将 snake_case 转换为 camelCase
- 保持数据库和 JavaScript 命名规范一致

---

## 环境变量

数据库配置存储在 `.env` 文件中：
- `DB_HOST`: 数据库地址
- `DB_PORT`: 数据库端口
- `DB_USER`: 用户名
- `DB_PASSWORD`: 密码
- `DB_NAME`: 数据库名
