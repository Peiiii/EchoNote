# i18n AI 指南（StillRoot）

目标：让 AI 批量完成国际化改造时 **稳定、可维护、可自动化验证**。本项目当前只支持 `en` 与 `zh-CN`。

## 你要遵守的硬规则

1. **禁止在 JSX 里硬编码用户可见文案**：包括直接写在标签里的文字，以及 `title/description/label/placeholder/alt/aria-label/...` 这类属性。
2. **所有新增 i18n key，`en` 与 `zh-CN` 必须同时存在且 value 不能为空**：否则 `pnpm i18n:check` 会失败。
3. **每个阶段都要验证**：至少跑 `pnpm i18n:check && pnpm lint && pnpm exec tsc -b && pnpm build`（可按修改范围拆分，但最终必须全过）。

## 现有 i18n 机制（你要基于它工作）

- 初始化：`src/common/i18n/index.ts`
  - 语言存储：`localStorage["stillroot-lang"]`
  - 资源加载：`public/locales/{{lng}}/{{ns}}.json`（会自动拼 `import.meta.env.BASE_URL`）
- 入口初始化：`src/main.tsx` 在 React render 前执行 `await initI18n()`（避免 key 闪烁）
- 资源目录：
  - `public/locales/en/common.json`
  - `public/locales/zh-CN/common.json`
- 自动化：
  - 提取：`pnpm i18n:extract`（i18next-parser，会把代码里的 key 合并进 JSON）
  - 提取校验（CI/门禁用）：`pnpm i18n:extract:check`（如果提取会修改 `public/locales` 则失败）
  - 校验：`pnpm i18n:check`（严格检查两种语言 key 对齐、value 非空）
- 自查硬编码（强烈建议 AI 每次都跑）：
  - 仅检查本次改动文件：`pnpm i18n:lint`
    - 说明：基于 `git diff`（含未暂存/已暂存/未跟踪文件），也可传入文件列表：`pnpm i18n:lint -- src/a.tsx src/b.tsx`
  - 全量扫描（作为最终门禁）：`pnpm i18n:lint:all`
- 硬编码检测（渐进启用，当前是 warn）：
  - ESLint 规则：`local/no-hardcoded-ui-text`
  - 当前生效范围：`src/landing/**` + `src/common/features/auth/**`（见 `eslint.config.js`）
  - 覆盖面：只检查 JSX 里的文案（JSXText + `title/label/placeholder/alt/aria-*` 等属性），不覆盖 toast/日志/业务字符串

## Key 命名规范（必须一致）

用“模块/页面 → 区块 → 组件/字段”的层级，全部小写，点分隔：

- `landing.hero.badge`
- `landing.hero.title`
- `landing.hero.subtitle`
- `landing.footer.links.privacy`
- `auth.login.title`
- `auth.login.local.button`

不要把具体文案塞进 key（例如 `landing.hero.start_now` OK，`landing.hero.立即开始` 不行）。

默认使用 namespace `common`；等 key 规模上来后再拆 namespace（例如 `landing.json`、`auth.json`），但一次拆就要把两种语言一起拆并更新 `i18n` 初始化 `ns`。

## 改造步骤（AI 必须按这个流程走）

### 1) 改代码：把硬编码文案替换为 i18n

在 React 组件内：

```ts
import { useTranslation } from "react-i18next";
const { t } = useTranslation();
```

- JSX 文本：`<span>{t("landing.hero.badge")}</span>`
- 属性文案：`<input placeholder={t("auth.email.placeholder")} />`
- 带插值：`t("x.y", { name })`，JSON 写 `Hello, {{name}}`

复杂富文本（需要嵌套标签/加粗/换行等）：

```tsx
import { Trans } from "react-i18next";
<Trans i18nKey="landing.hero.title">
  Default <strong>fallback</strong>
</Trans>
```

注意：不要字符串拼接来“凑句子”。如果语序会因语言变化而变化，必须用 `t(..., { ... })` 或 `<Trans />`。

非 React 代码（例如 modal 工具函数）：

- 使用 `i18n.t("...")`（见 `src/common/features/auth/open-login-modal.tsx`）

### 2) 生成/更新词条：运行提取

运行：

```bash
pnpm i18n:extract
```

这一步会把你新增的 key 写入 `public/locales/en/common.json` 与 `public/locales/zh-CN/common.json`（项目配置为 `keepRemoved: true`，所以删除 key 不会自动删 JSON，属于刻意的“安全策略”）。

### 3) 补齐两份翻译（由你调用编程 AI 完成）

要求：

- `en` 与 `zh-CN` 的 key 必须完全一致
- value 不允许空字符串
- 语义一致，避免“翻译风格漂移”（同一产品概念必须统一译法）

### 4) 强制验证（必须）

```bash
pnpm i18n:check
pnpm lint
pnpm exec tsc -b
pnpm build
```

如果 `lint` 里出现 `local/no-hardcoded-ui-text` 的 warning：

- 说明你漏改了 JSX 文案或文案属性
- 继续改，直到 warning 消失（后续可以把 warn 升级为 error，作为 CI 门禁）

如果你只想对“本次改动”做硬编码自查（推荐 AI 用这个避免噪音）：

```bash
pnpm i18n:lint
```

当你准备把 i18n 当成“不可回退”的工程规范时，用全量门禁：

```bash
pnpm i18n:lint:all
pnpm i18n:ci
```

## 常见误区（必须避免）

- 把 `className/variant/id/path` 之类的“非文案字符串”也改成 i18n（不需要，且会让代码变复杂）。
- 用拼接来构造句子：`t("a") + name + t("b")`（禁止，必须插值/Trans）。
- 只改 `en` 不改 `zh-CN`（`i18n:check` 会挂）。
- 新增 key 不跑提取，手写 JSON 导致层级错乱/拼写不一致（推荐“先改代码 → extract → 再补翻译”）。

## 渐进策略（你应当这样推进）

1. 先把 `src/landing/**` 与 `src/common/features/auth/**` 的硬编码清零（因为已经有 lint 提醒）。
2. 然后逐步扩大 ESLint 规则范围到 `src/**`，最后把 warn 升级为 error（杜绝回归）。
3. 当 key 数量足够大时再拆 namespace（避免早期过度工程）。
