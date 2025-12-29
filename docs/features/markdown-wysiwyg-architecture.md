# Echonote Markdown WYSIWYG 重构方案（建议稿）

本文档描述从架构视角重构“Markdown 兼容的所见即所得编辑器”的推荐路线、模块划分、关键设计、迁移策略与验收标准，指导团队按阶段推进改造。

## 1. 背景与目标

- 目标
  - Markdown 作为单一事实源（Single Source of Truth），WYSIWYG 与预览/导出一致
  - GFM 友好（表格/任务列表/删除线），支持数学、脚注、指令（Admonition）等增强语法
  - MD ↔ WYSIWYG 往返幂等、稳定（不抖动、不降级）
  - 可扩展（插件化）、可测试（AST 层快照/往返测试）、可渐进迁移
- 约束
  - 兼容现有内容与交互；复杂表格（合并单元格 > 1）允许保留 HTML
  - 现有 TipTap 编辑体验尽量保持

## 2. 总体方案（推荐）

路线 A：Markdown 为事实源 + unified（remark/rehype）做全链路转换 + TipTap 作为 UI 层。

- 数据模型
  - 存储：Markdown 文本（或 mdast JSON）+ frontmatter（页面元数据）
  - 渲染：mdast/hast → React；编辑：ProseMirror doc → TipTap
- 转换链路（统一基于 unified）
  - HTML → Markdown（粘贴/导入）：rehype-parse → 自定义 rehype 规范化（表格/图片/链接/指令）→ rehype-remark（remark-gfm/remark-math/remark-directive/remark-frontmatter）→ remark-stringify
  - Markdown → HTML（预览）：remark-parse + gfm/math/footnotes/directive/frontmatter → rehype-katex/rehype-sanitize → rehype-stringify（或 React 渲染）
- 编辑器层（TipTap）
  - 仅做 UI 和交互；用少量插件维持结构 invariant（表格表头、cell 扁平化、任务列表语义、数学节点）
- 桥接层（关键）
  - mdast ↔ ProseMirror doc 的双向映射（Node/Mark 一一对应；未知语法以 directive/raw HTML 兜底）

## 3. 模块划分

- markdown-core：unified 管线（parse/stringify）与通用 remark/rehype 插件注册
- markdown-plugins
  - rehype-table-normalize：表格表头/thead 插入、对齐映射（text-align → align）、cell 顶层 p 扁平化、复杂表识别
  - remark-enhancements：gfm、math、footnotes、directive/frontmatter 等
  - remark-table-fallback（可选）：“强制管道表”兜底开关（非复杂表仍为 HTML 时强转 Markdown 表）
- mdast-pm-bridge：mdast ↔ ProseMirror 的 toPM/toMD 映射与节点/标记表
- editor-extensions：TipTap 扩展（math、admonition、taskList、tablePlus 等）与 invariants 插件
- preview-renderer：统一 remark/rehype 配置的 React 渲染（复用 markdown-core）

## 4. 关键设计点（Best Practices）

- 表格（GFM pipe table）
  - 规范化：确保存在 THEAD（从第一行生成），THEAD 位置在 CAPTION/COLGROUP 之后、TBODY/TR/TFOOT 之前
  - 对齐：从 style.text-align 映射 align 属性，方便生成 :-:/--:/--
  - 内容：去掉 th/td 顶层 p，折叠多余空白，避免管道表被拆行
  - 复杂表：colspan/rowspan > 1 视为“无法用 Markdown 表达”，保留 HTML
  - 兜底（可选开关）：非复杂表 turndown/unified 仍生成 HTML 时，强制渲染为管道表
- 任务列表：与 GFM 结构一致（- [ ]/- [x]），编辑器复选框只管交互，序列化交给 remark-gfm
- 数学：remark-math + rehype-katex；TipTap 有 inline/block 两种节点，桥接层保持一致
- 指令/Admonition：remark-directive 承载（:::note），编辑器用对应容器节点呈现
- frontmatter：页面元数据（只读渲染/编辑器内隐藏或只读显示）
- 原始 HTML：无法映射的结构统一保留，避免数据降质

## 5. 桥接层（mdast ↔ ProseMirror）映射清单

- Node：paragraph/heading/blockquote/hr/code(codeBlock)/list(ordered/bullet)/taskList/table/thead/tbody/tr/th/td/math(inline/block)/admonition(directive)/footnote/reference/frontmatter
- Mark：em/strong/link/image/strike/code
- 策略：
  - toPM：mdast → PM（保持最少必要属性）；未知节点包装为“raw/html”占位
  - toMD：PM → mdast（保留语义、对齐、一致的数学与指令结构）
  - 未知语法/属性：以 directive 或 raw HTML 存储

## 6. 迁移策略（Phased Rollout）

Phase 0（已完成表格热修）
- 在现有 turndown 之上对表格做 DOM 规范化，稳定输出管道表（已合并）

Phase 1：替换 HTML → Markdown 管线（最小改造）
- 引入 unified：rehype-parse → rehype-table-normalize → rehype-remark + remark-gfm/math/directive/frontmatter → remark-stringify
- 保持“复杂表保留 HTML”策略；增加“强制管道表”可选开关
- 用 feature flag 切换旧/新管线，先对内部通道灰度

Phase 2：编辑器端 invariants 插件
- 表格：始终 withHeaderRow；禁止 cell 顶层 p；保留列对齐
- 任务列表/数学：基本输入规则（keymap/inputRules）

Phase 3：桥接层（mdast ↔ PM）
- 先 MD → PM（只读渲染），后补 PM → MD（保存路径）
- 保存/导出走 PM → mdast → remark-stringify；预览与导出复用同配置

Phase 4：统一与收敛
- 去掉 turndown/marked；预览、WYSIWYG、导入/导出全面统一到 unified
- 完整回归测试与数据对比

## 7. 测试与验收

- 往返幂等（核心）
  - Fixtures：中文/长文、对齐表格、无表头表格、colgroup、任务列表、数学（块/行内）、脚注、指令/Admonition、frontmatter
  - 断言：MD → (编辑器/HTML) → MD 与原文等价（允许空白差异）
- 片段测试
  - 表格单元格包含粗体/链接/代码/数学等组合
  - 嵌套结构（引用中列表、列表中代码、Admonition 中表格）
- 性能基准
  - 大文档解析/渲染/保存耗时，编辑态转换节流（debounce）与增量策略

## 8. 性能与体验

- 编辑态：变更节流（按段或按事务触发转换），避免每击键全量转换
- 预览与编辑复用同一套 remark/rehype 配置，防止“看起来一致但实现不同”的问题
- 图片：本地缓存、压缩策略；路径在 Markdown 层可控

## 9. 风险与应对

- SSR/无 DOM 环境：rehype-parse/remark 运行在 Node/浏览器均可；编辑器相关仅限浏览器
- 未知语法/HTML：统一保留为 raw/html 或 directive，避免丢失
- Schema 演进：frontmatter 标注版本；桥接层做兼容迁移

## 10. 里程碑与任务清单（建议）

- M1（1 周）
  - 引入 unified；实现 HTML→MD 管线与表格规范化插件（rehype-table-normalize）
  - 加入 feature flag 与最小回归测试（表格/任务/数学）
- M2（1–2 周）
  - TipTap invariants 插件（表格/任务/数学）
  - 扩充测试：多语种/长文/嵌套/脚注/指令
- M3（2–3 周）
  - 实现 mdast → PM 映射（只读），再补 PM → mdast；保存路径切换
  - 去除 turndown/marked；统一 preview 配置
- M4（1 周）
  - 文档化“Echonote Markdown 规范”与扩展示例；性能基线与优化

---

附：当前代码对应位置（参考迁移）

- turndown/marked 仍在：`src/common/utils/markdown-converter.ts`（后续由 unified 替换）
  - `htmlToMarkdown` → 将迁移为 unified 管线
  - `markdownToHtml` → 保持 remark/rehype 一致配置
  - 表格规范化逻辑 → 提炼为 `rehype-table-normalize`

如需，我可以先提交 Phase 1 的最小改造 PR（引入 unified + 表格规范化插件，保留开关），并附一组往返测试用例作为模板。

