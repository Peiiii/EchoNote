# Agent Skills（面向 AI 的完整介绍文档）

本文档面向“其它 AI / Agent 框架 / 智能体运行时”的读者，目标是让一个不具备相关训练数据的模型，也能从零理解并实现一套可用的 **Agent Skills（技能）** 系统，并能把它与 **Tools（工具）**、**Workflows（流程）**、**MCP（Model Context Protocol）** 等概念清晰区分与集成。

> 术语约定：本文用 “Skill/技能” 指代“可复用、可触发、可执行/可指导的任务包”；用 “Agent” 指代具备规划、调用工具、修改代码/产出结果的执行体；用 “Tool/工具” 指代一个可调用的能力接口（函数/HTTP/API/脚本/本地命令）；用 “Runtime/宿主” 指代承载 Agent 的应用（CLI、IDE、Web、后端服务等）。

---

## 目录

- 为什么需要 Skills
- Skills 与 Tools/Prompts/MCP 的关系
- Skills 的产品/架构目标（你应该优化什么）
- Skills 的运行机制（从发现到执行）
- Skill 包结构（文件/目录约定）
- SKILL.md：元数据与正文的设计方法
- Bundled Resources：scripts / references / assets 的最佳实践
- 触发与编排：什么时候加载、怎么选择、怎么避免误触发
- 可验证性：让技能“可重复、可回归、可评估”
- 安全与治理：权限、沙箱、密钥、审计、供应链
- 版本化与分发：安装、更新、兼容性
- 与 MCP 的深度集成方式
- 跨生态映射：OpenAI/Anthropic/LangChain 等的对应关系
- 反模式与检查清单
- 附录：模板与示例
- 参考链接（只引用，不搬运原文）

---

## 为什么需要 Skills

**核心矛盾**：基础模型再强，也无法稳定掌握你组织的私有知识、复杂流程、易错操作、以及大量“重复但必须一致”的工程细节。

Skills 解决的是“把隐性经验变成可复用的、机器可执行/可遵循的 SOP”的问题：

- **可复用**：同类任务不需要每次重新发明流程。
- **可控**：把自由度收敛到适当范围，降低“聪明但跑偏”的概率。
- **可演进**：流程变更时，更新 Skill 比更新一堆提示词/散落文档更可靠。
- **可治理**：统一管理权限、审计、版本、发布与回滚。
- **可评估**：可以对技能输出做回归测试、成功率统计、质量基准。

把 Skill 看成“给 Agent 的入职手册 + 可执行脚本 + 参考资料 + 模板资产”的组合，会更接近工程现实。

---

## Skills 与 Tools/Prompts/MCP 的关系

很多系统里这些词会被混用，建议用下面的分层来消除歧义：

### 1) Prompt（提示/指令）

- 一段文本指令（可能包含 few-shot 示例）
- **单次对话可用**，但通常缺乏：版本管理、资源组织、可执行脚本、验证机制
- 适合：轻量、一次性、低风险任务

### 2) Tool（工具）

- 一个可调用的函数/接口：输入参数 -> 输出结果（或副作用）
- 关注点：参数 schema、可用性、错误处理、权限边界、执行时延
- 适合：把能力“外部化”、让 Agent 不靠臆测做事实性/确定性操作

### 3) Skill（技能）

- 一个“任务包”：**什么时候用**、**怎么做**、**用哪些工具**、**如何验证**、**有哪些模板与参考**。
- Skill 可以只包含“流程指导”（不含任何 Tool），也可以绑定一组工具与脚本。
- 适合：高频、易错、需要一致性、需要组织知识的任务

### 4) MCP（Model Context Protocol）

- 一种标准协议，用于让 Runtime 把“资源（resources）/工具（tools）/提示（prompts）”以统一方式提供给模型/Agent。
- MCP 本质上是“能力与上下文的可插拔接口层”，Skill 则是“如何组合这些能力完成任务的流程层”。

一句话总结：

- **Tool = 能力接口**
- **MCP = 接入/传递能力与上下文的标准协议**
- **Skill = 能力编排 + 过程知识 + 验证与资产**

---

## Skills 的产品/架构目标（你应该优化什么）

如果你在设计一套 Skill 系统，不要只优化“写起来方便”，而要优化下列指标：

1. **成功率（Task Success Rate）**：在真实数据与约束下的完成率
2. **一致性（Consistency）**：不同时间/不同上下文，输出质量是否稳定
3. **可回归（Regressability）**：流程/代码变更后是否可验证不破
4. **上下文效率（Context Efficiency）**：用最少 token 支撑最多能力
5. **治理性（Governance）**：权限、审计、来源可信、供应链安全
6. **可组合（Composability）**：技能之间能否协作而不重复实现逻辑

这里最关键的设计原则是：**渐进式披露（Progressive Disclosure）**。

---

## Skills 的运行机制（从发现到执行）

一个成熟的 Skill Runtime 通常包含以下阶段：

1) **Discovery（发现）**

- 扫描技能目录/注册表
- 读取每个 Skill 的“轻量元信息”（例如：`name` 与 `description`）
- 把这些元信息加入模型可见的“可用技能列表”

2) **Triggering（触发）**

- 当用户请求到来时，Runtime 或 Agent 决定是否使用某个 Skill
- 触发条件常见来源：
  - 用户显式点名（例如“用 $xxxSkill”）
  - 描述匹配（metadata 的 `description` 与请求语义匹配）
  - 策略路由（产品内路由、权限、租户配置、场景标签）

3) **Loading（加载）**

- **只在触发后** 才加载该 Skill 的正文与引用资源
- 运行时需避免“一股脑把全部技能全文塞进上下文”

4) **Execution（执行）**

- Skill 指导 Agent 的计划与步骤
- 期间可能调用工具（工具调用/脚本执行/MCP tools）
- 期间可能读取参考资料（MCP resources / 本地 references）

5) **Verification（验证）**

- Skill 应明确：如何验证输出正确（测试、lint、类型检查、对账、diff 等）
- 将“验证”纳入流程是技能工程化的关键分水岭

6) **Reporting（回报）**

- 报告做了什么、改了哪些文件、验证结果、如何回滚、已知风险

7) **Learning（沉淀/演进）**

- 把失败案例/新边界条件回写到 Skill（或 references）
- 把重复的临时代码固化为 scripts

---

## 参考实现：Skill Runtime 架构蓝图（最佳实践）

如果你要“从产品到工程”把技能体系做扎实，建议把 Runtime 明确拆成以下模块（可单进程实现，也可服务化）：

- **Skill Registry（注册表）**：发现技能、解析元信息、建索引、做版本/来源治理
- **Skill Router（路由器）**：给定用户请求，选择 0~N 个候选技能并消解冲突
- **Context Manager（上下文管理）**：决定加载哪些正文/参考、做裁剪与缓存（避免上下文爆炸）
- **Executor（执行器）**：运行技能步骤（调用工具/脚本/MCP），维护状态机与重试
- **Verifier（验证器）**：执行技能声明的验证命令/断言，产出可审计结果
- **Auditor（审计器）**：记录“用了什么技能/调用了什么工具/改了什么/验证了什么”

### 数据模型（建议最小字段）

把每个 Skill 视为一个“可索引对象”：

```ts
type SkillMeta = {
  name: string;               // 唯一键（同名冲突需策略解决）
  description: string;        // 触发路由的主信号（应短而明确）
  version?: string;           // 可选：用于治理与兼容
  source?: string;            // 可选：curated / org / local / git url
  risk?: "low" | "medium" | "high";
  requires?: { tools?: string[]; mcpServers?: string[] };
};
```

正文与资源不应在“发现阶段”常驻内存/上下文，只保留可索引的元信息。

### 路由算法（可落地的混合检索）

最佳方案通常是“多路召回 + 统一排序”：

1. **显式点名召回**：用户直接提到 `skill-name`
2. **词法召回（lexical）**：BM25/关键词匹配（高精度、可解释）
3. **向量召回（semantic）**：embedding 相似度（高召回、抗同义改写）
4. **策略过滤**：权限/租户/环境/风险门槛
5. **统一排序**：综合得分 + 规则重排（更具体的技能优先）

典型排序特征：

- 匹配度（lexical + semantic）
- 具体性（description 越具体越优先）
- 风险（高风险技能默认降权，除非用户显式确认）
- 成功历史（该技能过去在同类场景的成功率）
- 依赖可用性（需要的工具/MCP server 是否存在）

### 冲突消解（多候选时的 UX）

当 top-1 不够自信，推荐让用户做选择题，而不是“猜一个就干”：

- 输出 2~3 个候选技能名 + 一句话差异
- 要求用户确认（尤其是高风险技能）
- 允许用户追加约束（比如“只读模式”“不跑部署”）

### 执行状态机（建议）

把技能执行当作状态机而不是“自由对话”：

- `planned`：已生成计划（包含验证步骤）
- `running`：正在执行（逐步产生日志与中间结果）
- `blocked`：缺输入/缺权限/缺依赖（等待用户或系统提供）
- `verifying`：跑验证
- `succeeded` / `failed`：产出报告 + 可回滚信息

这样可以显著降低“执行一半忘了验证/忘了总结”的概率。

### 对其它 AI 的“技能执行协议”（建议直接遵守）

当你（作为 AI）被要求使用某个 Skill 时，建议遵循以下固定协议：

1. **先读元信息**：确认适用性与边界；不确定就提问澄清
2. **再读正文**：只加载该 Skill 的 SKILL.md 正文，不要加载无关技能
3. **按需读 references**：只在步骤需要时读取对应参考
4. **优先用 scripts**：能脚本执行就别手打重复逻辑
5. **必须跑 Verification**：除非用户明确跳过（并告知风险）
6. **输出可审计报告**：改了什么、怎么验证、失败如何恢复

---

## Skill 包结构（文件/目录约定）

一个通用、跨运行时可移植的 Skill 包可以用如下结构表达：

```
<skill-name>/
  SKILL.md                # 必需：元数据 + 说明/流程（AI 可读）
  scripts/                # 可选：可执行脚本（确定性、可复用）
  references/             # 可选：按需加载的参考资料（大文本放这里）
  assets/                 # 可选：模板/静态文件（不建议进上下文）
```

### 必须文件：`SKILL.md`

建议包含两层信息：

- **Frontmatter（YAML 元数据）**：用于“是否触发”的快速判断（应很短）
- **Body（Markdown 正文）**：用于“触发后怎么做”的工作流说明（可分段、可引用外部文件）

一个典型的最小元数据：

```yaml
---
name: my-skill
description: Do X when user asks Y; includes workflow and verification steps.
---
```

你应假设 Runtime 在触发前**只读取元数据**（尤其是 `name` 与 `description`），其余正文按需加载。

---

## SKILL.md：元数据与正文的设计方法

### 设计 `description`：让“触发”可靠

`description` 不是宣传文案，而是路由信号。应写清：

- 用户会如何表述需求（同义词/领域词）
- 适用边界（什么情况下不要用）
- 关键能力（会做什么、不会做什么）

一个好 `description` 的结构（可直接借用）：

- “当用户想要 ____（任务）时使用”
- “适用于 ____（场景）”
- “不适用于 ____（排除条件）”

### 正文：把自由度收敛到合适范围

可以把技能正文按“自由度”分三类，按任务风险选择：

1. **高自由度**：文字指导 + 关键检查点
2. **中自由度**：伪代码/命令模板 + 可选参数
3. **低自由度**：直接给脚本/固定命令序列（几乎不允许改动）

经验法则：越是“易错/不可逆/损失大”的操作，越应该降低自由度，并强制验证与确认。

### 渐进式披露（Progressive Disclosure）

把信息拆成三层：

1. **元数据（常驻）**：`name` + `description`（极短）
2. **正文（触发后加载）**：流程与决策（控制规模）
3. **资源（按需加载/执行）**：
   - references：只在需要时读
   - scripts：尽量直接执行，避免把全脚本塞进上下文
   - assets：作为输出模板/素材，不建议读入上下文

### 正文建议固定包含的章节（面向 AI）

为了让“其它 AI”更稳定地执行技能，建议每个技能正文都包含以下结构（可以是标题，也可以是清单）：

- **When to use / When not to use**
- **Inputs**：需要用户提供什么（文件、路径、账号、环境）
- **Outputs**：产出物是什么（文件、PR、报告、指标）
- **Constraints**：不可违反的规则（安全、权限、格式、依赖）
- **Step-by-step workflow**：步骤序列（包含检查点）
- **Verification**：至少一条可运行的验证命令/方法
- **Failure modes & recovery**：常见错误与修复路径

---

## Bundled Resources：scripts / references / assets 的最佳实践

### `scripts/`：把脆弱步骤变成确定性执行

适用场景：

- 每次都要重复写的代码/命令
- 对参数格式敏感、手写易错
- 需要可审计的副作用（文件写入、网络调用、数据库变更）

脚本设计建议：

- **幂等（Idempotent）**：重复运行不应破坏状态
- **可预览（Dry-run）**：支持预览 diff/将要执行的操作
- **可回滚（Rollback）**：至少输出回滚建议或生成备份
- **严格退出码**：成功 `0`，失败非 `0`
- **机器可读输出**：支持 `--json` 或结构化日志，便于 Agent 总结
- **最小权限**：只请求/使用必要权限与 token

> 原则：**能脚本化就脚本化**，把随机性从模型侧移到可执行代码侧。

### `references/`：把“大文本”从上下文常驻区挪出去

适用场景：

- API 文档、数据库 schema、业务术语、规范、长 FAQ
- 只在少数分支流程需要的细节

建议：

- 在技能正文中写明“什么时候需要读哪个 reference”
- 为大文件提供可检索入口（例如推荐的关键字/`rg` 模式）
- 避免重复：信息应只存在于正文或 references 之一

### `assets/`：模板与静态资源

适用场景：

- 代码/文档模板、UI 素材、规范样式文件
- 最终输出要复制/修改的基线

建议：

- 不要依赖模型“记住模板细节”，用 assets 直接拷贝再局部编辑
- 资产尽量稳定，变更要配合版本号

---

## 触发与编排：什么时候加载、怎么选择、怎么避免误触发

### 触发策略（推荐组合）

1. **显式触发优先**：用户点名的 Skill > 自动匹配
2. **语义匹配**：用 `description` 做高召回匹配（但要有边界）
3. **策略过滤**：基于权限/租户/环境/风险等级过滤不可用技能
4. **冲突消解**：当多个技能都匹配，提供：
   - 选择题（让用户确认）
   - 或优先级规则（更具体/更低自由度优先）

### 避免“误触发”的实践

- `description` 写清“不适用条件”
- 让技能正文第一步包含“前置条件检查”
- 高风险技能必须包含“确认点”（例如提示用户确认目标环境/分支）

### 技能编排（Skill-of-Skills）

大型任务往往需要多个技能协作。推荐：

- 一个“编排技能”只负责拆解与路由
- 子技能各自负责单一职责
- 禁止同一逻辑在多个技能重复实现（保持唯一性）

---

## 可验证性：让技能“可重复、可回归、可评估”

没有验证的 Skill，长期一定会退化成“玄学提示词”。

建议把验证分为三层：

1) **静态验证**

- lint、formatter、typecheck、schema validation

2) **构建验证**

- build、bundle、compile（确保产物能生成）

3) **行为验证**

- 单元测试/集成测试
- 关键路径的最小回归脚本（golden files / snapshot）

如果你在实现 Runtime：

- 让 Skill 能声明“验证命令”
- 让验证结果进入最终报告（成功/失败、失败原因、日志位置）

如果你在写 Skill：

- “Verification” 必须是可执行、可复制的命令/步骤
- 验证应尽量快速（否则会被跳过）

---

## 安全与治理：权限、沙箱、密钥、审计、供应链

Skill 系统一旦能执行脚本/调用网络，就立刻进入“生产系统安全”的范畴。

### 权限边界

- Skill 不应天然拥有所有权限；权限应由 Runtime 授予（最小权限）
- 高危操作（删库、覆盖、发布）应要求二次确认或审批

### 密钥与敏感信息

- Skill 文档里不要硬编码密钥
- 用环境变量/密钥管理服务注入
- 输出中避免打印 token/PII；需要时做脱敏

### 沙箱与隔离

- 文件系统：限制可写目录
- 网络：按域名/协议白名单
- 进程：限制可执行命令集合

### 审计与可追踪

- 记录：使用了哪些技能、调用了哪些工具、改了哪些文件、跑了哪些验证
- 对脚本来源做校验：版本、hash、签名（视安全需求）

### 供应链风险

- 从远程安装 Skill 时，必须有来源可信策略（官方 curated / 组织私仓）
- 依赖拉取要可复现（lockfile、固定版本、校验 hash）

---

## 版本化与分发：安装、更新、兼容性

一个可运营的 Skill 体系需要“像软件一样发布”：

- **版本号**：语义化版本（SemVer）或日期版本
- **兼容性声明**：需要的 Runtime 版本/工具版本
- **变更记录**：至少能追溯到 git commit 或 release notes
- **安装渠道**：
  - curated marketplace（白名单）
  - 组织内 repo（私有技能）
  - 本地技能目录（开发/实验）

运行时应支持：

- 列出可用技能
- 安装/更新/卸载
- 冲突处理（同名技能、版本冲突）
- 冷启动/热加载策略（最简单：重启生效）

---

## 案例：Codex CLI Skills（一个可参考的落地规范）

下面以 Codex CLI 的 Skills 机制为例，说明一套“工程化技能系统”在实现层面通常会做哪些约束（便于你迁移/复刻到其它 AI 运行时）。

### 目录与文件约定

- 技能安装目录：`$CODEX_HOME/skills`（常见默认是 `~/.codex/skills`）
- 每个技能一个目录：`<skill-name>/`
- 必需文件：`SKILL.md`
- 可选目录：`scripts/`、`references/`、`assets/`

### 触发模型（Progressive Disclosure 的典型实现）

- 运行时在“决定是否触发技能”时，只读取 `SKILL.md` 的 **YAML frontmatter** 中的：
  - `name`
  - `description`
- `description` 是最关键的触发信号：写得越清晰，越能减少误触发/漏触发。
- **只有在触发之后**，运行时才会加载 `SKILL.md` 正文；而 `references/` 等资源是“按需再读”。

这意味着技能作者的首要工作是：

- 用尽可能少的 token，把触发边界写进 `description`。
- 把大段细节移到 `references/`，正文只保留流程与导航。

### 技能内容组织原则（强约束，利于长期维护）

- Skill 目录内避免创建额外“辅助文档”（例如 README、CHANGELOG 等），避免信息分散与冗余。
- 避免重复：同一信息只存在于正文或某个 reference 文件，不要复制粘贴两份。
- 能脚本化的重复操作，应沉淀为 `scripts/`，减少模型自由发挥造成的波动。

### 分发与安装（可运营能力）

- 运行时通常区分：
  - **system skills**：随运行时预置（例如 `.system`）
  - **curated skills**：来自官方/白名单仓库
  - **local skills**：用户自定义（本地目录）
- 安装器一般支持：
  - 列出 curated 列表
  - 从 GitHub 等来源安装指定技能路径
  - 避免覆盖已存在同名目录（减少供应链与误覆盖风险）
- 安装后常见要求：**重启运行时**以重新发现技能目录并刷新索引

> 这套设计的本质是：用“元信息极小常驻 + 正文触发加载 + 资源按需加载”的方式，最大化上下文效率与可治理性。

---

## 与 MCP 的深度集成方式

把 MCP 当作“技能的外设总线”：

- Skill 负责描述“要读什么资源、要调用什么工具、顺序与验证”
- MCP Server 提供：
  - **resources**：可读取的上下文（文件、DB schema、工单、指标）
  - **tools**：可调用的动作（搜索、写入、部署、查询）
  - （有些实现还会提供 prompts/templates）

推荐的集成模式：

1) Skill 正文声明“需要哪些 MCP server/工具/资源”
2) Runtime 在执行前做能力检查（缺哪个就提示安装/授权）
3) 关键工具调用走 MCP，避免把私有系统细节直接写进 Skill

这样可以把“流程（Skill）”与“能力实现（MCP Server）”解耦：

- 流程变更：改 Skill
- 数据源/接口变更：改 MCP Server
- 二者独立发布与治理

---

## 跨生态映射：OpenAI / Anthropic / LangChain 等怎么对应

不同生态名称不同，但可以映射到同一抽象：

- **Tool calling（工具调用）**：函数调用/结构化输出 -> Tool
- **Agent loop（思考-行动-观察循环）**：Runtime/Orchestrator
- **Prompt library / cookbook**：低阶 Skill（只有文本，没有脚本与资源）
- **Playbooks / Runbooks**：更像工程化 Skill（包含步骤、验证、回滚）
- **Retrieval / RAG**：通常落在 references/resources（按需加载）
- **Plugins / Extensions**：常对应“工具集合 + 权限 + UI 集成”，可被 Skill 编排

如果你要把 Skill 体系迁移到另一个 Agent 框架，关键是保持：

- 元信息（触发路由）
- 资源组织（references/assets/scripts）
- 验证与审计（可回归）

---

## 反模式与检查清单

### 常见反模式

- **把所有细节堆进 SKILL.md**：导致上下文膨胀，触发后也难用
- **没有 Verification**：技能不可回归，长期必然失效
- **同一逻辑多处实现**：多个技能复制粘贴相同流程，维护灾难
- **把业务逻辑写进 UI 层**：工具/技能与 UI 耦合，难测试难迁移
- **技能描述含糊**：触发不稳定、误用频繁

### Skill 作者检查清单（建议逐条打勾）

- [ ] `description` 明确“何时用/何时不用”
- [ ] 正文包含 Inputs / Outputs / Constraints
- [ ] 有清晰的 step-by-step workflow
- [ ] 至少一个可执行验证步骤（lint/build/test/typecheck/对账）
- [ ] 大文本放到 `references/`，正文只保留导航与关键决策
- [ ] 易错操作有脚本化或低自由度指令
- [ ] 涉及权限/密钥的内容有安全说明
- [ ] 失败模式与恢复路径写清楚

---

## 附录：模板与示例

### A) SKILL.md 模板（可复制）

```markdown
---
name: <skill-name>
description: >
  Use when the user wants to <task>. Suitable for <scenarios>.
  Not suitable for <exclusions>.
---

# <Skill Title>

## When to use
- ...

## When NOT to use
- ...

## Inputs
- ...

## Outputs
- ...

## Constraints
- ...

## Workflow
1. ...
2. ...

## Verification
- Run: `<command>`

## Failure modes & recovery
- ...
```

### B) 目录模板

```
my-skill/
  SKILL.md
  scripts/
    main.sh
  references/
    api.md
    schema.md
  assets/
    template.md
```

---

## 参考链接（只引用，不搬运原文）

- OpenAI Skills（示例与组织方式）：https://github.com/openai/skills
- MCP（Model Context Protocol）相关：https://modelcontextprotocol.io/ （若你的运行时/组织采用该协议）
- Anthropic 文档（tool use / agents 的相关内容）：https://docs.anthropic.com/
- OpenAI 开发者文档（tools / structured outputs）：https://platform.openai.com/docs
- LangChain Agents/Tools 概念对照：https://python.langchain.com/
