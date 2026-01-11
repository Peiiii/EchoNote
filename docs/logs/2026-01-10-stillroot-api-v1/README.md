# 2026-01-10 — StillRoot API v1（Worker + PAT）

## 范围

本次迭代引入 **StillRoot API v1** 的后端实现（Cloudflare Worker），并在 Web 端加入 **PAT（Personal Access Token，个人访问令牌）** 的创建/管理入口。

目标：

- 提供一套 **标准 HTTP API**（不是“只给 agent 用”的私有接口），同时优先优化 agent 体验（游标分页、幂等等）。
- 将隐私面尽量收缩：只开放必要接口。
- **不泄漏用户的 Firebase ID Token** 给外部调用方：外部调用统一使用 **PAT**；Firebase ID Token 仅在 Web 端用于 PAT 管理。

## 本次交付内容

### 规范（Spec）

- OpenAPI v1：`docs/api/stillroot-api.v1.openapi.yaml`
- 规范入口：`docs/api/README.md`

### 后端（Cloudflare Worker）

- Worker：`workers/app-api`
- 路由（v1）：
  - `GET /openapi.json`
  - `GET /v1/channels`（PAT，`notes:read`）
  - `POST /v1/channels`（PAT，`notes:write`，支持幂等）
  - `GET /v1/messages`（PAT，`notes:read`，**必须传 `channelId`**，cursor 分页）
  - `POST /v1/messages`（PAT，`notes:write`，**必须传 `channelId`**，支持幂等）
  - `GET /v1/pats`（Firebase ID Token，仅 Web 端使用）
  - `POST /v1/pats`（Firebase ID Token，仅 Web 端使用；**token 只显示一次**）
  - `DELETE /v1/pats/{patId}`（Firebase ID Token，仅 Web 端使用）
- 明确 **不提供**：
  - `GET /v1/health`
  - message 的 `restore/move/delete`

### 前端（PAT 管理 UI）

- 桌面端：时间线 Header 的“更多（…）”菜单新增 `API 访问`入口。
- 桌面端：新增 Settings 侧栏，并提供 `API 访问` Tab：创建/列出/撤销 PAT，并支持“一键复制给 Agent”。
- Web 端调用 StillRoot API 管理 PAT 时，使用 Firebase ID Token；外部工具/agent 调用时使用 PAT。

## 数据模型与安全说明

- Firestore 访问（服务端使用 service account）涉及集合：
  - `users/{uid}/channels`
  - `users/{uid}/messages`
  - `users/{uid}/pats`（PAT 元信息）
  - `pat_tokens/{tokenId}`（PAT 鉴权的全局索引）
  - `idempotency/{id}`（幂等记录）
- PAT 存储策略：
  - 服务端**不保存明文 PAT**。
  - `tokenId = sha256(pat + TOKEN_PEPPER)` 用作查找 key。
  - PAT 元信息保存在 `users/{uid}/pats/{patId}`。

## 如何验证（本地）

### 0）一键启动（推荐）

在项目根目录执行：

```bash
pnpm dev
```

它会同时启动：

- 前端（Vite，默认从 `5173` 起找可用端口）
- StillRoot API Worker（`http://localhost:8787`）
- API Gateway Worker（`http://localhost:8788`）

其中：

- 前端由 Vite 自动加载根目录的 `.env.development`（开发环境）。
- Worker 由 Wrangler 自动加载各自目录下的 `.dev.vars`（开发环境；该文件应保持本地，不提交）。

启动前请确保准备好：

- `workers/app-api/.dev.vars`（复制自 `workers/app-api/.dev.vars.example` 并填写）
- `workers/api-gateway/.dev.vars`（如需要；复制自 `workers/api-gateway/.dev.vars.example` 并填写）

说明：已在各自 Worker 的 `wrangler.toml` 中固定不同的 `inspector_port`，避免并发启动时发生 `127.0.0.1:9229` 冲突。

### 1）安装依赖

```bash
pnpm install
```

### 2）Worker 类型检查（阶段性验证）

```bash
pnpm -C workers/app-api typecheck
```

### 3）Lint + Build（阶段性验证）

```bash
pnpm lint
pnpm build
```

也可以用一条命令跑完整校验：

```bash
pnpm verify
```

### 4）本地启动 Worker

先设置变量/密钥（见下文），然后：

```bash
pnpm -C workers/app-api dev
```

如果你是本地开发（未部署），建议用 `workers/app-api/.dev.vars` 提供变量/密钥（该文件已被 `.gitignore` 忽略）：

```bash
cat > workers/app-api/.dev.vars <<'EOF'
FIREBASE_PROJECT_ID=echo-note-9fe01
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@echo-note-9fe01.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
TOKEN_PEPPER=please-generate-a-long-random-string
EOF
```

获取这些信息的方式：

- `FIREBASE_PROJECT_ID`：你的 Firebase Project ID（前端已有 `VITE_FIREBASE_PROJECT_ID` 可参考）。
- `GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`：Firebase Console → Project settings → Service accounts → Generate new private key，下载 JSON 后取：
  - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`（注意保留换行；必要时转成 `\n`）
- `TOKEN_PEPPER`：随机长字符串（应用级机密，用于 PAT 哈希）；可用 `openssl rand -hex 32` 生成。

### 5）验证 PAT 闭环

1. 启动 Web（`pnpm dev`）并登录（邮箱已验证）。
   - 如果 `5173` 被占用：Vite 会自动选择下一个可用端口（`vite.config.ts` 已设置 `strictPort: false`）。
2. 桌面端时间线 Header 的“…”菜单 → `API 访问`。
3. 创建 PAT，点击“复制给 Agent”（会把使用规则 + JSON 配置一次性复制到剪贴板），粘贴给 agent。
4. agent 保存其中的 `sr_pat_...`，后续所有 API 调用都带 `Authorization: Bearer sr_pat_...`。
5. 使用 PAT 调用 API（用 `curl` 模拟 agent；注意：messages 相关 API 必须携带 `channelId`）：

```bash
TOKEN="sr_pat_..."
BASE_URL="http://localhost:8787"

curl -sS -H "Authorization: Bearer $TOKEN" "$BASE_URL/v1/channels"

CHANNEL_ID="从上一步 channels 返回里选一个 id"

# 不带 channelId 必须 400
curl -sS -H "Authorization: Bearer $TOKEN" "$BASE_URL/v1/messages"

curl -sS -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/v1/messages?channelId=$CHANNEL_ID&limit=20"

curl -sS -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-1" \
  -d "{\"channelId\":\"$CHANNEL_ID\",\"content\":\"hello from api\",\"sender\":\"user\"}" \
  "$BASE_URL/v1/messages"
```

如果你希望“把链接给 agent 之后，agent **只需要这一个链接**就能开始用”：

- 正确姿势是：你在 UI 里创建 PAT 并“一键复制给 Agent”，agent 保存 `sr_pat_...`，后续全部 API 调用都用 `Authorization: Bearer sr_pat_...`。

## 如何发布/部署（Cloudflare）

Worker 配置：`workers/app-api/wrangler.toml`

### 必需变量/密钥

- Var：`FIREBASE_PROJECT_ID`
- Var：`GOOGLE_SERVICE_ACCOUNT_EMAIL`
- Secret：`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`（PEM；支持 `\n` 转义）
- Secret：`TOKEN_PEPPER`（随机长字符串；用于 PAT 哈希）

示例：

```bash
cd workers/app-api

wrangler secret put GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
wrangler secret put TOKEN_PEPPER

wrangler deploy
```

### 一键部署所有 Workers（推荐）

在项目根目录执行：

```bash
pnpm deploy:workers
```

说明：

- `pnpm deploy:workers` 会先运行 `pnpm verify:workers`（workers 类型检查）再部署，避免发布半路失败。
- `workers/api-gateway` 含 Durable Objects。如遇到“缺少 class / migration tag 不匹配”这类部署错误，需要确保 `wrangler.toml` 的 `[[migrations]]` tag 与线上历史一致，并保留线上依赖过的 DO class（例如 `ExtensionAuth`）直到完成正式删除迁移。
