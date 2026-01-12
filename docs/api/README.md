# StillRoot API（v1）

本目录定义 StillRoot 的 **标准 HTTP API**：任何客户端都可用，同时优先优化 agent 使用体验（游标分页、幂等、严格错误等）。

## 入口文件

- OpenAPI 3.1：`docs/api/stillroot-api.v1.openapi.yaml`
- 后端实现（Cloudflare Worker）：`workers/app-api`

## 设计原则（v1）

- 隐私面最小化：只提供 agent 工作流必要的接口。
- messages 相关 API 必须包含 `channelId`（请求+响应）。
- 外部调用统一使用 **PAT**（`sr_pat_...`）；Firebase ID token 仅用于 Web 端管理 PAT。
- 不提供 `GET /v1/health`，不提供 message 的 `restore/move/delete` 等非必要接口。

## 端到端接入（PAT）

v1 使用 **PAT（Personal Access Token）** 供外部工具/agent 调用，避免向外部暴露 Firebase 登录态。

1) Web 端创建 PAT：`POST /v1/pats`（Firebase ID token；仅 Web 端使用）
2) 复制返回的 `sr_pat_...`（明文只展示一次）发给 agent/tool
3) 使用 PAT 调用 `/v1/channels` 与 `/v1/messages`

## 部署（workers/app-api）

Worker 配置：`workers/app-api/wrangler.toml`

运行时变量/密钥：

- `FIREBASE_PROJECT_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`（Wrangler secret；PEM，支持 `\n`）
- `TOKEN_PEPPER`（Wrangler secret；用于 PAT 哈希）
