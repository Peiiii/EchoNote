# StillRoot Clipper（Chrome Extension）MVP 规划与设计

## 1. 背景与定位
StillRoot Clipper 的角色不是"另一个入口"，而是把用户主循环的第一步做到极致：**Capture（采集）**。

核心目标：让用户在任意网页里 **1 秒保存**（右键/快捷键/按钮），并且内容 **可追溯（来源可信）**、**可再加工（可选 AI）**、**可移动归类（空间切换）**。

约束：
- **仅支持 Chrome（MV3）**
- **不支持本地模式**（必须登录云端账户）
- 功能可以少，但 **体验必须稳定、快速、可预期**

## 2. MVP 交付范围
### 2.1 入口（必须）
- 右键菜单：
  - Save to StillRoot
  - Save to StillRoot (with summary)
  - Save screenshot to StillRoot
- 工具栏按钮（popup）：
  - Quick save：保存选区/页面
  - 保存截图
  - 配对（Connect）
  - AI 选项（可选、记忆）
- 快捷键：
  - `Alt+Shift+S`：保存选区/页面
  - `Alt+Shift+C`：保存截图

### 2.2 保存内容（必须）
- 选中文本（selection）优先；无选区则降级为整页链接（page）
- 截图（screenshot）：默认可视区域截图（第一版）
- 写入 StillRoot 的“默认空间”
  - 默认：用户的“第一个空间”
  - 保存后如果用户在卡片里切换空间，则：
    - 立即把刚保存的内容移动到目标空间
    - 记忆本次选择为“下次默认空间”

### 2.3 可信（必须）
保存内容必须携带来源信息：
- URL、标题、站点、采集时间
- 原文引用块（用于报告/引用场景）

### 2.4 AI（可选）
首版允许在 popup 里勾选并记忆：
- Summary
- Key points
- Action items
- Translate to English

默认关闭，避免“保存变慢”影响核心体验。

## 3. 交互设计（参考 YouMind）
### 3.1 保存反馈：右上角浮层卡片（content script 注入）
保存成功后在页面右上角弹出卡片（9 秒自动消失）：
- 左侧：`已保存到 <SpaceName> ▾`
  - 点击展开空间列表（支持搜索）
  - 切换后自动移动刚保存的条目
- 右侧：`去 StillRoot 查看`
  - 打开深链：定位到对应空间 + 高亮对应消息
- 右上角：关闭 `×`

这套卡片是 MVP 的“体验核心”，必须做到：
- 反馈快（无 toast 堆叠、无阻塞）
- 操作可撤回/可更改（切换空间即刻生效）
- 视觉干净、不遮挡网页内容

### 3.2 配对体验（不依赖打开 StillRoot Tab）
原则：插件无需依赖 “必须打开 StillRoot 的某个 Tab 才能保存”。

配对流程（一次性）：
1) 用户在 StillRoot 内打开 `/#/extension/connect`
2) 生成 6 位配对码（10 分钟过期）
3) 在插件 popup 输入配对码并 Connect
4) 插件获得长期 Bearer token（后续所有写入走后端 API）

## 4. 技术架构（唯一实现、低耦合）
### 4.1 组件分工
**Chrome Extension（纯采集 + 交互）**
- content script：注入右上角卡片、空间切换 UI
- service worker：右键/快捷键/按钮触发采集、调用 API、转发状态给 content script
- popup：配对 + AI 偏好 + Quick save

**Cloudflare Worker（Ingest API，统一业务入口）**
- 负责：
  - 校验插件 token（Bearer）
  - 获取/创建默认空间
  - 写入 Firestore（channel/message）
  - 移动 message（换空间）
  - 提供 space 列表
  - 可选调用 AI（摘要等）
- 目标：把“写入协议”变成唯一实现，未来移动端/分享入口都复用这套 API。

### 4.2 数据写入：Firestore Admin
MVP 采用 Worker 通过 service account 直写 Firestore：
- `users/{uid}/channels/{channelId}`
- `users/{uid}/messages/{messageId}`

这样插件不需要 Firebase SDK，也无需打开网页就能写入。

### 4.3 配对与偏好：Durable Object
使用一个全局 Durable Object 存：
- pairing code -> userId
- token -> userId
- userId -> defaultChannelId

实现文件：
- `workers/api-gateway/src/extension-auth-do.ts`

## 5. API 设计（MVP）
Base：`https://api-gateway.stillroot.app`

### 5.1 配对
- `POST /extension/pair/start`
  - Auth：`Authorization: Bearer <firebaseIdToken>`
  - 返回：`{ code: "123456", expiresAt: <ms> }`
- `POST /extension/pair/finish`
  - Body：`{ code }`
  - 返回：`{ token, userId, expiresAt }`

### 5.2 写入与空间
- `POST /ingest`
  - Auth：`Authorization: Bearer <extensionToken>`
  - Body：见 `workers/api-gateway/src/ingest/types.ts`
  - 返回：`{ messageId, channelId, channelName, openPath }`
- `GET /ingest/spaces`
  - Auth：`Authorization: Bearer <extensionToken>`
  - 返回：`{ spaces: [{ id, name, emoji? }] }`
- `POST /ingest/move`
  - Auth：`Authorization: Bearer <extensionToken>`
  - Body：`{ messageId, fromChannelId, toChannelId }`
  - 返回：`{ channelId, channelName }`

## 6. 深链打开与定位
StillRoot 使用 HashRouter，深链必须包含 `/#/`。

Worker 返回的 `openPath` 形如：
- `/#/notes?space=<channelId>&message=<messageId>`

Web 端在 `NotesPage` 解析 query 并调用现有跳转/高亮逻辑（scroll + highlight）。

## 7. 安全与隐私（MVP）
- 插件 token 为 Bearer token，存放在 `chrome.storage.local`
- 不支持本地模式：只允许 cloud session 用户配对
- 最小权限：
  - `contextMenus`, `storage`, `activeTab`, `scripting`, `tabs`, `commands`
- 传输全程 HTTPS
- 采集内容默认只包含：
  - 选区文本（用户显式选择）
  - 截图（用户显式触发）
  - 页面 URL/标题/站点

## 8. 体验与可靠性策略
### 8.1 性能
- 保存动作必须快速返回 UI 状态
- AI 默认关闭，避免把主动作变慢

### 8.2 失败策略
- 未配对：提示并自动打开 `/#/extension/connect`
- API 失败：显示简短错误 toast，不阻塞用户继续浏览

### 8.3 Firestore 限制
截图会迅速逼近 Firestore 单文档大小限制（~1MB）。
MVP 采用：
- service worker 侧压缩 JPEG + 限制体积
- 仍建议 Roadmap 中尽快迁移到 R2（仅在 message 里存 URL）

## 9. 配置与部署（当前实现）
### 9.1 Worker 环境变量（必须配置）
在 `workers/api-gateway`：
- `FIREBASE_API_KEY`：与前端 `VITE_FIREBASE_API_KEY` 相同，用于校验 Firebase ID token
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- Secret：`FIREBASE_PRIVATE_KEY`（service account 私钥）

### 9.2 部署命令
```bash
cd workers/api-gateway
pnpm exec wrangler secret put FIREBASE_PRIVATE_KEY
pnpm run deploy
```

## 10. 里程碑（建议）
### M0：体验闭环（已实现骨架）
- 配对页 + 配对 token
- 选区/整页写入
- 右上角卡片 + 切换空间移动 + 记忆默认空间
- 深链打开定位

### M1：截图增强（高优先）
- 截图上传改为 R2（避免 Firestore 限制）
- 支持全页截图（可选）

### M2：AI 增强（可选）
- AI 结果结构化（summary/keypoints/actionitems）并以固定 Markdown 模板落库
- 允许用户自定义默认 AI 动作

## 11. 验收标准（MVP）
- 右键/快捷键保存成功率高（网络正常情况下近乎 100%）
- 保存成功后 300ms 内出现卡片反馈（本地 UI），并在 2–5s 内完成写入
- 切换空间移动成功，并在 StillRoot 内可立刻看到移动后的结果
- 配对只需一次，之后无需打开 StillRoot Tab 也能保存

