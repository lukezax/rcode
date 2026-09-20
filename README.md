# AI 邀请码分享平台

一个专注于 AI 工具邀请码/推荐码分享的平台：按工具分类展示邀请码，用户上传并分享，社区通过「有效/无效」反馈筛选真实可用的码。

## 目录结构

```
rcode/
├── backend/     # 后端服务（NestJS + TypeScript + SQLite）
├── frontend/    # 用户端 Web（React + Arco Design）
├── admin/       # 管理后台 Web（React + Arco Design）
├── docs/        # 需求 / 开发 / 实施计划文档
└── README.md
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | NestJS 10 + TypeScript + TypeORM |
| 数据库 | SQLite（sql.js，零配置，文件存储） |
| 认证 | JWT + bcrypt |
| API 文档 | Swagger |
| 用户端 | React 18 + Arco Design + Zustand + Axios |
| 管理后台 | React 18 + Arco Design + Zustand + Axios |

## 功能概览

- **目标工具**：预置 20 个主流 AI 工具，支持分类/搜索；用户可申请新增，管理员审批
- **邀请码**：登录用户上传；列表部分隐藏，详情页登录后展示完整码并可复制
- **有效性反馈**：有效/无效投票，可改票；有效>无效为「有效」，反之「无效」，相等为「待验证」
- **举报与管理**：用户举报，管理员核实下架/驳回；邀请码管理、用户封禁、数据看板
- **防刷**：同一用户对同一码只能投一票、不能自投、同一工具每日最多上传 3 条、邀请码全局唯一

## 快速开始

### 环境要求

- Node.js 18+
- npm

> 数据库使用 SQLite，无需安装任何数据库服务。

### 1. 启动后端

```bash
cd backend
npm install
cp .env.example .env   # 可按需修改端口 / JWT 密钥
npm run start:dev
```

- 服务地址：http://localhost:3000
- Swagger 文档：http://localhost:3000/api-docs
- 首次启动会自动建表并初始化：管理员账号 + 20 个预置目标

默认管理员账号：

```
邮箱：admin@example.com
密码：admin123
```

### 2. 启动用户端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 3. 启动管理后台

```bash
cd admin
npm install
npm run dev
```

访问 http://localhost:5174

## 端到端测试

后端提供端到端测试脚本（覆盖认证、目标、邀请码、反馈、举报、用户中心、管理后台，共 38 项断言）：

```bash
# 先确保后端已启动（干净数据库效果最佳）
bash backend/scripts/e2e-test.sh
```

## API 概览

| 分组 | 路径前缀 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 注册、登录、当前用户 |
| 目标 | `/api/targets` | 列表、详情、邀请码列表、申请新增 |
| 邀请码 | `/api/codes` | 详情、上传、查看计数、反馈、举报 |
| 用户中心 | `/api/me` | 我的上传、我的反馈、我的申请 |
| 管理后台 | `/api/admin` | 目标审批、邀请码管理、举报处理、统计、用户管理 |

完整接口文档见 Swagger：http://localhost:3000/api-docs

## 文档

- [使用说明书](./docs/使用说明书.md)（面向用户 / 管理员 / 运维）
- [需求分析文档](./docs/需求分析文档.md)
- [开发文档](./docs/开发文档.md)
- [实施计划文档](./docs/实施计划文档.md)

## 免责声明

平台仅提供信息分享，不参与交易，不保证邀请码 100% 有效及奖励兑现。
