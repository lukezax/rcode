# AI 邀请码分享平台 - 后端

基于 NestJS 的 AI 邀请码分享平台后端服务。

## 技术栈

- **框架**：NestJS 12
- **语言**：TypeScript 5
- **数据库**：SQLite（sql.js，零配置，文件存储）
- **ORM**：TypeORM 1.x
- **认证**：JWT + Passport
- **API 文档**：Swagger

## 项目结构

```
src/
├── config/                 # 配置文件
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
├── common/                 # 公共模块
│   ├── decorators/         # 装饰器
│   ├── filters/            # 过滤器
│   ├── guards/             # 守卫
│   ├── interceptors/       # 拦截器
│   ├── pipes/              # 管道
│   └── utils/              # 工具函数
├── modules/                # 业务模块
│   ├── auth/               # 认证模块
│   ├── users/              # 用户模块（含实体）
│   ├── targets/            # 目标模块（含实体）
│   ├── codes/              # 邀请码模块（含实体）
│   ├── feedbacks/          # 反馈模块（含实体）
│   ├── reports/            # 举报模块（含实体）
│   ├── me/                 # 用户中心（我的上传/反馈/申请）
│   └── admin/              # 管理模块
├── migrations/             # 数据库迁移（可选）
├── app.module.ts           # 根模块
└── main.ts                 # 入口文件
```

## 快速开始

### 环境要求

- Node.js 20+
- npm

> 数据库使用 SQLite（sql.js），无需安装任何数据库服务。

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置（SQLite，文件路径）
DB_DATABASE=data/ai_referral_platform.db

# JWT 配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 应用配置
PORT=3000
NODE_ENV=development
```

### 初始化数据

数据库文件会在首次启动时自动创建。启动时由 `DataInitService` 自动完成：

- 创建默认管理员账号（`admin@example.com` / `admin123`）；
- 幂等写入 20 个预置目标。

```bash
npm run start:dev
```

### 启动项目

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

### 访问 API 文档

启动项目后，访问：http://localhost:3000/api-docs

## API 接口

### 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| GET | /api/auth/me | 获取当前用户信息 |

### 目标接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/targets | 获取目标列表 |
| GET | /api/targets/:id | 获取目标详情 |
| GET | /api/targets/:id/codes | 获取目标下的邀请码列表 |
| POST | /api/targets/apply | 申请新增目标 |

### 邀请码接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/codes/:id | 获取邀请码详情（游客隐藏、登录完整） |
| POST | /api/codes | 上传邀请码 |
| POST | /api/codes/:id/view | 增加查看次数 |
| POST | /api/codes/:id/feedback | 提交反馈 |
| POST | /api/codes/:id/report | 举报邀请码 |

### 用户中心接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/me/codes | 我的上传 |
| GET | /api/me/feedbacks | 我的反馈 |
| GET | /api/me/applications | 我的目标申请 |

### 管理后台接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/targets/pending | 待审批目标 |
| POST | /api/admin/targets/:id/approve | 通过目标 |
| POST | /api/admin/targets/:id/reject | 拒绝目标 |
| GET | /api/admin/codes | 邀请码管理列表 |
| POST | /api/admin/codes/:id/remove | 下架邀请码 |
| GET | /api/admin/reports | 举报列表 |
| POST | /api/admin/reports/:id/resolve | 处理举报 |
| GET | /api/admin/stats | 统计数据 |
| GET | /api/admin/users | 用户列表 |
| POST | /api/admin/users/:id/toggle | 封禁/解封用户 |

## 开发指南

### 创建新模块

```bash
# 使用 NestJS CLI 创建模块
npx nest g module modules/example
npx nest g controller modules/example
npx nest g service modules/example
```

### 数据库迁移

开发环境通过 TypeORM `synchronize: true` 自动同步表结构，无需手动迁移。如需版本化迁移：

```bash
# 生成迁移文件
npm run migration:generate -- -n InitSchema

# 执行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

### 代码规范

- 使用 TypeScript 严格模式
- 使用 ESLint + Prettier 格式化代码
- 变量命名：驼峰式（camelCase）
- 类命名：帕斯卡式（PascalCase）
- 文件命名：短横线式（kebab-case）

## 测试

```bash
# 单元测试
npm run test

# e2e 测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 部署

### 构建

```bash
npm run build
```

### 生产环境配置

1. 设置 `NODE_ENV=production`
2. 设置强密码的 `JWT_SECRET`
3. 关闭数据库同步 `synchronize: false`
4. 使用迁移管理数据库变更

### Docker 部署（待完善）

```bash
# 构建镜像
docker build -t ai-referral-backend .

# 运行容器
docker run -p 3000:3000 ai-referral-backend
```

## 许可证

MIT
