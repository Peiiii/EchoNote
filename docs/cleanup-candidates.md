# Cleanup candidates (Musk 5-step) — StillRoot

目的：把“没有实际使用 / 不会展示 / 不发挥作用”的代码、模块、配置项整理成一份可执行清理清单，方便后续逐步删减与验证。

> 本文只做“裁剪候选 + 结论”，不直接改代码逻辑；真正删除前建议先按本文的验证步骤跑一遍。

## 方法与证据来源

1. **可达性（reachability）**：从 `src/main.tsx` 作为入口，基于 TypeScript AST 收集 `import/export-from/dynamic import/require` 依赖图，BFS 计算可达文件。
2. **功能开关（feature flags）**：检查 `src/core/config/features.config.ts` 中固定为 `enabled: false` 的分支，定位“永远不会渲染/永远不会触发”的 UI/功能路径。
3. **路由/面板渲染**：检查 `sideView` 的渲染分支与 `openXxx/closeXxx` 的入口，定位“有入口但无渲染”的死路径。

## A. 高置信度：可直接删除（不影响行为）

### A1. 完全无引用组件（dead file）

- `src/core/components/icon-registry.tsx`
  - 证据：全仓无引用（`rg "IconRegistry"` 仅命中定义处），且在可达性扫描中是唯一不可达文件。
  - 结论：可以直接删除该文件（以及任何配套导出，如果存在）。

## B. 高置信度：当前配置下“永远不会展示/生效”的功能分支

> 这类代码并非“不可达”（可能被 import 进来），但在当前 `getFeaturesConfig()` 返回的固定常量配置下，属于“永远不会被用户看到/触发”的路径。

### B1. Thread 相关 UI（被 feature flag 永久关闭）

- flag：`getFeaturesConfig().channel.thoughtRecord.thread.enabled === false`（`src/core/config/features.config.ts`）
- 影响：
  - 桌面端 thread 入口不会渲染（`MessageFooter` 里 gated）。
  - 移动端 thread 入口直接 `return null`（`MobileThreadIndicator`）。
  - 但 thread-management 侧边栏与 presenter 路径仍存在（增加心智负担）。
- 结论：如果短期不做 Thread 功能，可删除 thread 入口组件、thread-management 相关 UI、以及与之绑定的文案/样式/服务代码（需先做一次“决定：做 or 删”）。

### B2. ThoughtRecord 的 Reply / Bookmark / ViewDetails（被 feature flag 永久关闭）

- flags：
  - `getFeaturesConfig().channel.thoughtRecord.reply.enabled === false`
  - `getFeaturesConfig().channel.thoughtRecord.bookmark.enabled === false`
  - `getFeaturesConfig().channel.thoughtRecord.viewDetails.enabled === false`
- 影响：
  - `ActionButtons` 里这些按钮在过滤后不会出现；且目前对应 `onClick` 也多为 `undefined`（即使启用也不完整）。
- 结论：若不打算做这三项功能，建议整体删掉对应按钮定义、菜单项、翻译 key、以及未完成的服务/状态分支（属于“最佳删减收益/低风险”）。

### B3. Channel settings（UI 层有入口但 flag 永久关闭）

- flag：`getFeaturesConfig().channel.settings.enabled === false`
- 影响：Header 上“Settings”按钮在桌面端不会渲染。
- 结论：如果短期不做 channel settings，则可删除这部分入口与相关页面/组件；否则应把 flag 改成可配置并补齐 Settings 面板渲染（见 C1）。

## C. 高置信度：有入口但不会展示（产品路径不闭环）

### C1. Desktop Settings 面板不会被渲染

- 现状：
  - 状态层存在 `SideViewEnum.SETTINGS`，且 `openSettings()` 会把 `sideView` 设为 `SETTINGS`。
  - 但桌面端侧边栏渲染 `switch(sideView)` 没有处理 `SETTINGS` 分支（只处理 `THREAD/AI_ASSISTANT/STUDIO`）。
- 影响：桌面端“Settings”即使被触发，也不会显示任何 UI（典型“实现存在但不发挥作用”）。
- 结论（必须二选一）：
  1) **删**：如果不做桌面 Settings，就移除 `SETTINGS` 分支、相关入口与组件；
  2) **补**：如果要做桌面 Settings，就补齐 `SETTINGS` 的 sidebar 渲染与对应组件（并把入口打通）。

## D. 中置信度：配置项“写了但从未被读取”（可删或接线）

> 这类多半是“未来功能预留”，目前无引用、无行为影响；删掉能显著降低心智噪音。

- `data.migrations.enabled`：未在任何地方读取（当前迁移执行逻辑也未受该 flag 控制）
- `ui.globalProcess.workspaceInit.displayMode`：未在任何地方读取
- `channel.input.emoji.enabled / call.enabled / video.enabled`：未在任何地方读取

结论：如果你们倾向“只保留已接线的配置”，这些项可以删掉；否则应尽快把它们接入实际逻辑，避免配置漂移。

## E. 生产永远不会展示（开发态专用）

- Demo extension：只在 `import.meta.env.DEV` 注册（桌面端）
  - 结论：对生产行为无影响，但对仓库体积/维护成本有影响。
  - 选项：
    - 若 demo 价值低：整体删除 `src/desktop/features/demo/**`；
    - 若 demo 仍需保留：建议通过更强隔离（例如动态 import、独立 package、明确的 “DEV only” 目录/命名），避免污染主业务。

## 建议清理顺序（按马斯克五步法）

1. **Make requirements less dumb**：先明确哪些功能是“必须要做”的（Thread/Reply/Bookmark/ViewDetails/Desktop Settings/输入扩展）。
2. **Delete**（优先级从高到低）：
   - 直接删除 A1（无引用死文件）。
   - 删除 B2（三项 thoughtRecord 功能：永远 false 且不完整）。
   - 处理 C1（桌面 Settings：删或补，不能悬空）。
3. **Simplify**：
   - 把 `getFeaturesConfig()` 从“写死常量”升级为“可环境覆盖/可实验开关”，否则会长期积累“关着但占心智”的分支。
4. **Accelerate**：
   - 对 demo、实验性模块做强隔离（DEV-only 动态 import / 分包）。
5. **Automate**：
   - 引入 unused export/file 检测工具（例如 knip/ts-prune）并作为 PR 门禁的一部分（和 `i18n:lint` 同级）。

## 删除前的验证清单（建议每次删一组都跑）

- `pnpm lint`
- `pnpm exec tsc -b`
- `pnpm build`
- 关键手动验收：桌面端 Notes 页（header/menu/timeline/input）、移动端 Notes 页（sidebar/settings/ai assistant）、公开 space 页面（如有）

