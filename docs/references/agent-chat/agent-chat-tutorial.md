# @agent-labs/agent-chat 使用教程（更新版）

本教程基于当前代码结构重写，移除了过时的 Provider 与 Hook（如 useProvideAgentToolDefs 等）。你将看到如何用最小心智负担把 Agent 与工具接入现有 UI。

目录

- 安装
- 快速开始（最简上手）
- 推荐用法（完整能力）
  - 构造 AgentSessionManager
  - 提供工具：定义、执行器、渲染器
  - 渲染 UI 并接通工具
- API 摘要
  - 关键类型与组件
  - 常用 Hooks
  - addMessages 用法

## 安装

使用 npm 安装必要依赖：

```bash
# 组件库
npm i @agent-labs/agent-chat
# 可选：HTTP Agent 客户端（示例里演示如何对接 HTTP 服务）
npm i @ag-ui/client
```

说明：你可以对接任意实现了 IAgent 接口的 Agent。若使用 @ag-ui/client，建议封装一个适配器（参考 playground/mapped-http-agent.ts）。

## 快速开始（最简上手）

下面演示如何用一个空工具集启动窗口版聊天：

```tsx
import { AgentChatWindow, useAgentSessionManager, useParseTools } from "@agent-labs/agent-chat";
import type { Tool } from "@agent-labs/agent-chat";
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({ url: "http://localhost:8000/openai-agent" });
const tools: Tool[] = [];

export default function App() {
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);
  const sessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: () => [],
    initialMessages: [],
    getToolExecutor: name => toolExecutors[name],
  });
  return <AgentChatWindow agentSessionManager={sessionManager} toolRenderers={toolRenderers} />;
}
```

提示：库不内置任何工具，需由宿主应用自行提供（定义、执行器、渲染器）。

## 推荐用法（完整能力）

三种工具类型一览（详见 docs/tools.md 工具系统指南）：

- 后端执行（Backend-Only）：仅实现 render 用于展示信息（可选，未实现则使用默认渲染器）；不实现 execute。执行与结果完全由后端/Provider 产生；UI 在 partial-call/call 阶段显示“准备参数中/执行中…”，待结果事件到达后展示结果。
- 前端执行 + 渲染（Frontend-Execution + Render）：同时实现 execute 与 render。execute 负责前端逻辑与结果，render 用于在执行前后展示参数/状态/结果或补充交互。
- 纯交互（User-Interaction）：仅实现 render，不实现 execute；在 UI 中收集用户输入，点击后调用 onResult 回传结果。

### 三种类型的独立示例（严格对应）

以下分别给出每一种类型的最小可运行示例，便于对照与对接。

1. 后端执行 Backend-Only（仅 render，不 execute）

```tsx
import { AgentChatWindow, useAgentSessionManager, useParseTools } from "@agent-labs/agent-chat";
import type { Tool } from "@agent-labs/agent-chat";
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({ url: "http://localhost:8000/openai-agent" });

const tools: Tool[] = [
  {
    name: "serverTime",
    description: "由后端返回当前时间（后端/Provider 执行）",
    parameters: { type: "object", properties: {}, required: [] },
    // 不实现 execute；仅实现 render 用于展示状态/结果
    render: invocation => {
      if (invocation.state !== "result")
        return <div className="text-sm text-muted-foreground">后端执行中…</div>;
      return (
        <pre className="text-xs whitespace-pre-wrap break-all">
          {JSON.stringify(invocation.result, null, 2)}
        </pre>
      );
    },
  },
];

export default function BackendOnlyDemo() {
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);
  const sessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: () => [],
    initialMessages: [],
    getToolExecutor: name => toolExecutors[name], // 这里不会被调用，因为无 execute
  });
  return <AgentChatWindow agentSessionManager={sessionManager} toolRenderers={toolRenderers} />;
}
```

说明：如果你不实现 render，也会使用默认 ToolCallRenderer 展示“准备参数中/执行中/结果”。

2. 前端执行 + 渲染 Frontend-Execution + Render（同时实现 execute 与 render）

```tsx
const tools: Tool[] = [
  {
    name: "webSearch",
    description: "前端执行并渲染搜索结果",
    parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
    execute: async toolCall => {
      const { query } = JSON.parse(toolCall.function.arguments);
      await new Promise(r => setTimeout(r, 600));
      return { items: [`关于 ${query} 的结果 A`, `结果 B`] };
    },
    render: invocation => {
      if (invocation.state !== "result") {
        const args =
          typeof invocation.args === "string" ? invocation.args : JSON.stringify(invocation.args);
        return <div className="text-sm text-muted-foreground">搜索中… 参数: {args}</div>;
      }
      return (
        <pre className="text-xs whitespace-pre-wrap break-all">
          {JSON.stringify(invocation.result, null, 2)}
        </pre>
      );
    },
  },
];
```

3. 纯交互 User-Interaction（仅 render，通过 onResult 回传）

```tsx
import * as React from "react";

// 将交互组件独立出来，避免每次 render 返回新组件导致状态重置
const CalculatorUI = ({
  invocation,
  onResult,
}: {
  invocation: any;
  onResult: (r: any) => void;
}) => {
  const [a, setA] = React.useState(0);
  const [b, setB] = React.useState(0);
  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        value={a}
        onChange={e => setA(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      />
      <span>+</span>
      <input
        type="number"
        value={b}
        onChange={e => setB(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      />
      <button
        className="px-3 py-1 rounded bg-blue-600 text-white"
        onClick={() =>
          onResult({ toolCallId: invocation.toolCallId, result: { sum: a + b }, state: "result" })
        }
      >
        计算
      </button>
    </div>
  );
};

const tools: Tool[] = [
  {
    name: "calculator",
    description: "计算两个数的和（交互式）",
    parameters: {
      type: "object",
      properties: { a: { type: "number" }, b: { type: "number" } },
      required: ["a", "b"],
    },
    render: (invocation, onResult) => <CalculatorUI invocation={invocation} onResult={onResult} />,
  },
];
```

### 1) 定义工具（可选 execute 与 render）

```tsx
import type { Tool } from "@agent-labs/agent-chat";

const tools: Tool[] = [
  {
    name: "search",
    description: "搜索网络信息",
    parameters: {
      type: "object",
      properties: { query: { type: "string", description: "关键词" } },
      required: ["query"],
    },
    execute: async toolCall => {
      const { query } = JSON.parse(toolCall.function.arguments);
      // 调用你的后端/第三方 API
      return { results: [`关于 ${query} 的结果 A`, `结果 B`] };
    },
    // 可选：自定义 UI 渲染（如需要交互）
    // render: (invocation, onResult) => { ...; onResult({ toolCallId, result, state: 'result' }) }
  },
];
```

### 2) 解析工具，得到三件事：definitions / executors / renderers

```tsx
import { useParseTools } from "@agent-labs/agent-chat";

const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);
```

### 3) 创建会话管理器（AgentSessionManager），并渲染 UI

```tsx
import { useAgentSessionManager, AgentChatWindow } from "@agent-labs/agent-chat";
import { agent } from "./agent";

const sessionManager = useAgentSessionManager({
  agent, // 你的 Agent（实现 IAgent）
  getToolDefs: () => toolDefs, // 工具定义（供模型选择工具）
  getContexts: () => [], // 上下文数组（可选）
  initialMessages: [], // 初始消息（可选）
  getToolExecutor: name => toolExecutors[name], // 执行器（本地执行）
});

return <AgentChatWindow agentSessionManager={sessionManager} toolRenderers={toolRenderers} />;
```

### 动态上下文管理（示例）

推荐把 contexts 通过 `useAgentSessionManager` 的 `getContexts` 提供：

```tsx
const [user, setUser] = useState({ name: "张三", role: "dev" });
const sessionManager = useAgentSessionManager({
  agent,
  getToolDefs: () => toolDefs,
  getContexts: () => [{ description: "用户信息", value: JSON.stringify(user) }],
  initialMessages: [],
  getToolExecutor: name => toolExecutors[name],
});
```

### 完整示例：三种工具类型（后端渲染/前端执行+渲染/交互式）

以下示例同时包含三类工具：

- getTime：仅 execute（前端直接返回结果）
- webSearch：execute + 异步模拟（延时返回）
- calculator：仅 render（交互式 UI，点击后通过 onResult 回传）

```tsx
import * as React from "react";
import { AgentChatWindow, useAgentSessionManager, useParseTools } from "@agent-labs/agent-chat";
import type { Tool } from "@agent-labs/agent-chat";
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({ url: "http://localhost:8000/openai-agent" });

// 1) 定义三种不同形态的工具
const tools: Tool[] = [
  {
    // 后端执行（Backend-Only）：不实现 execute，仅实现 render 用于展示工具信息/状态
    name: "serverTime",
    description: "由后端返回当前时间",
    parameters: { type: "object", properties: {}, required: [] },
    render: invocation => {
      if (invocation.state !== "result") {
        return (
          <div className="p-3 border rounded-md text-sm">
            <div className="text-muted-foreground">后端执行中…（等待 Provider 返回结果）</div>
          </div>
        );
      }
      return (
        <div className="p-3 border rounded-md text-sm">
          <div className="font-medium mb-1">后端结果</div>
          <pre className="text-xs whitespace-pre-wrap break-all">
            {JSON.stringify(invocation.result, null, 2)}
          </pre>
        </div>
      );
    },
  },
  {
    // 前端执行 + 渲染（Frontend-Execution + Render）
    name: "webSearch",
    description: "模拟搜索（异步）",
    parameters: {
      type: "object",
      properties: { query: { type: "string", description: "关键词" } },
      required: ["query"],
    },
    execute: async toolCall => {
      const { query } = JSON.parse(toolCall.function.arguments);
      await new Promise(r => setTimeout(r, 800));
      return { items: [`“${query}” 的搜索结果 A`, `结果 B`, `结果 C`] };
    },
    // 渲染器：在执行前后显示状态或结果（不强制调用 onResult）
    render: invocation => {
      const state = invocation.state;
      if (state !== "result") {
        const args =
          typeof invocation.args === "string" ? invocation.args : JSON.stringify(invocation.args);
        return (
          <div className="p-3 border rounded-md text-sm">
            <div className="text-muted-foreground mb-1">搜索中…</div>
            <div className="text-xs break-all">参数: {args}</div>
          </div>
        );
      }
      return (
        <div className="p-3 border rounded-md text-sm">
          <div className="font-medium mb-1">搜索结果</div>
          <pre className="text-xs whitespace-pre-wrap break-all">
            {JSON.stringify(invocation.result, null, 2)}
          </pre>
        </div>
      );
    },
  },
  {
    // 纯交互（User-Interaction）：仅 render，在 UI 中收集输入并通过 onResult 回传
    name: "calculator",
    description: "计算两个数的和（交互式）",
    parameters: {
      type: "object",
      properties: { a: { type: "number" }, b: { type: "number" } },
      required: ["a", "b"],
    },
    // 仅提供 render，用于用户交互；完成后通过 onResult 回传结果
    render: (invocation, onResult) => <CalculatorUI invocation={invocation} onResult={onResult} />,
  },
];

// 2) 解析为 definitions / executors / renderers
const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);

// 3) 建立会话管理器并渲染窗口
export default function FullToolsExample() {
  const sessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: () => [],
    initialMessages: [],
    getToolExecutor: name => toolExecutors[name],
  });
  return <AgentChatWindow agentSessionManager={sessionManager} toolRenderers={toolRenderers} />;
}
```

### 流式参数预览（HTML 生成器）

有些工具（例如 htmlGenerator）会以“参数流式输出（TOOL_CALL_ARGS_DELTA）→ 执行 → 返回结果”的节奏工作。为了让用户尽快看到效果，可以在 `partial-call`/`call` 阶段就渲染预览，即使参数仍不完整。

下面示例展示：在参数流式阶段实时把 `invocation.args` 当作 HTML 预览；当进入 `result` 阶段，改用 `invocation.result.html`。

```tsx
import * as React from "react";

const toolRenderers = {
  htmlGenerator: {
    definition: toolDefs.find(d => d.name === "htmlGenerator")!,
    render: invocation => {
      const [html, setHtml] = React.useState("");

      React.useEffect(() => {
        // 在参数流式阶段（partial-call / call），尝试从 args 中提取 HTML
        // args 可能是字符串（原始/部分 JSON/直接 HTML），也可能是对象
        const a = invocation.args as unknown;
        let next = "";
        if (typeof a === "string") {
          // 如果后端直接把局部 HTML 作为字符串流式输出，这里可以立即预览
          next = a;
        } else if (a && typeof (a as any).html === "string") {
          next = (a as any).html;
        }

        // 进入 result 阶段后，优先使用最终结果中的 html 字段
        if (invocation.state === "result") {
          const r = invocation.result as any;
          if (r && typeof r.html === "string") next = r.html;
        }
        if (next) setHtml(next);
      }, [invocation.args, invocation.state, invocation.result]);

      return (
        <div className="rounded border">
          <div className="px-2 py-1 text-xs text-muted-foreground border-b">
            {invocation.state === "partial-call" && "生成中（预览）…"}
            {invocation.state === "call" && "执行中…"}
            {invocation.state === "result" && "已生成"}
          </div>
          {/* 生产环境请务必进行 HTML 消毒（如 DOMPurify），并开启 sandbox */}
          <iframe
            title="html-preview"
            sandbox="allow-same-origin"
            style={{ width: "100%", height: 260, background: "white", border: "0" }}
            srcDoc={html}
          />
        </div>
      );
    },
  },
};
```

要点：

- `AgentEventHandler` 在参数流入时会把 tool-invocation 的 `state` 设为 `partial-call`，并不断更新 `args`；`ToolCallRenderer`/自定义渲染器据此可做“边生成边预览”。
- `args` 解析失败时库会保留原始字符串，你仍可展示部分内容；当解析成功或结果返回时再替换为更完整的预览。
- 预览 HTML 存在 XSS 风险；请使用 DOMPurify 等库进行消毒，且给 iframe 开 sandbox。

## API 摘要

### 关键组件

- `AgentChatWindow`: 聊天窗口（需传入 `agentSessionManager` 与 `toolRenderers`）
- `AgentChatCore`: 去壳的聊天核心（同上）
- `ChatInterface`: 仅包含消息列表与输入区（库内使用）

### 关键类型（简化）

- `ToolDefinition`: `{ name, description, parameters }`
- `Tool`: `ToolDefinition & { execute?: (toolCall) => ToolResult | Promise; render?: (invocation, onResult) => ReactNode }`
- `ToolRenderer`: `{ definition: ToolDefinition; render: (invocation, onResult) => ReactNode }`
- `ToolExecutor`: `(toolCall, context?) => ToolResult | Promise`

### 常用 Hooks

- `useParseTools(tools: Tool[])`: `{ toolDefs, toolExecutors, toolRenderers }`
- `useAgentSessionManager({ agent, getToolDefs, getContexts, initialMessages, getToolExecutor })`
- `useAgentSessionManagerState(sessionManager)`: `{ messages, isAgentResponding, threadId }`
- `useAgentChat`: 更贴近数据面的封装（如不使用 UI 组件，可用它驱动自定义界面）

### addMessages API（通过 AgentChatRef 或 useAgentChat）

```ts
addMessages(
  messages: UIMessage[],
  options?: { triggerAgent?: boolean },
): Promise<void>
```

示例：

```tsx
// 添加单条消息并触发 AI 响应（UIMessage 结构）
await addMessages([{ id: "1", role: "user", parts: [{ type: "text", text: "你好" }] }]);

// 批量添加历史消息，不触发 AI 响应
await addMessages(
  [
    { id: "1", role: "user", parts: [{ type: "text", text: "历史消息 1" }] },
    { id: "2", role: "assistant", parts: [{ type: "text", text: "历史回复 1" }] },
  ],
  { triggerAgent: false }
);

// 注入系统消息
await addMessages(
  [
    {
      id: Date.now().toString(),
      role: "system",
      parts: [{ type: "text", text: "请用简洁的语言回答" }],
    },
  ],
  { triggerAgent: false }
);
```

---

补充说明：

- 库会在发送消息到 Provider 前自动补全未完成的工具调用（将其标记为 result 并附带占位结果），以满足 OpenAI 等 API 每个 tool call 后必须跟随一个 tool 结果消息的约束；真实结果到达后会覆盖占位结果。
- 工具调用在 UI 中的“准备参数中/执行中/已完成”状态由内置的 ToolCallRenderer 负责展示，详见《工具系统指南》。
