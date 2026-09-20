# AI 邀请码分享平台

一个专注于 AI 工具邀请码分享的平台，解决邀请码信息分散、失效多、缺乏可信交换渠道的问题。

## 项目概述

### 核心功能

- 🎯 **目标分类**：按 AI 工具分类展示邀请码
- 📤 **邀请码上传**：用户可上传邀请码并获得曝光
- ✅ **有效性反馈**：社区投票验证邀请码有效性
- 🛡️ **管理后台**：目标审批、邀请码管理、举报处理

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端（用户端） | React + Arco Design |
| 前端（管理端） | React + Arco Design |
| 后端 | NestJS + TypeScript |
| 数据库 | PostgreSQL |
| 认证 | JWT + 邮箱登录 |
| 文件存储 | 本地存储 |

## 项目结构

```
rcode/
├── backend/                 # 后端项目（NestJS）
├── frontend/               # 前端项目（用户端）
├── admin/                  # 前端项目（管理端）
├── docs/                   # 项目文档
│   ├── 需求分析文档.md
│   ├── 开发文档.md
│   └── 实施计划文档.md
└── README.md
```

## 文档

- [需求分析文档](./docs/需求分析文档.md) - 详细的功能拆解、用户故事、验收标准
- [开发文档](./docs/开发文档.md) - 技术架构、数据库设计、API 设计
- [实施计划文档](./docs/实施计划文档.md) - 开发排期、任务分解、风险管理

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 15+
- npm 或 yarn

### 后端启动

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

### 管理端启动

```bash
cd admin
npm install
npm run dev
```

## 开发进度

- [ ] 需求确认与设计
- [ ] 数据库与后端基础
- [ ] 核心功能开发
- [ ] 管理后台开发
- [ ] 联调测试
- [ ] 上线准备

## 许可证

MIT
