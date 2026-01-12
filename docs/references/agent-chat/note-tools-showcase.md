# 笔记工具展示（Notes Tools Showcase）

本文档演示 StillRoot 中"笔记相关工具（Notes Tools）"在 Agent Chat 里的使用与展示方式，并对照《@agent-labs/agent-chat 使用教程（更新版）》的三种工具形态给出最小可用示例与推荐展示方案。

参考文档：./agent-chat-tutorial.md

## 工具一览（频道级 CRUD + 列表）

当前工具由 `ChannelToolsManager` 按频道提供：

- createNote：在当前频道创建一条新笔记
- readNote：按 ID 读取单条笔记内容
- updateNote：按 ID 更新笔记内容
- deleteNote：按 ID 删除笔记
- listNotes：列出当前频道内的笔记

实现位置：

- `src/common/features/ai-assistant/services/channel-tools-manager.ts:25`（createNote）
- `src/common/features/ai-assistant/services/channel-tools-manager.ts:69`（readNote）
- `src/common/features/ai-assistant/services/channel-tools-manager.ts:118`（updateNote）
- `src/common/features/ai-assistant/services/channel-tools-manager.ts:176`（deleteNote）
- `src/common/features/notes/components/tools/list-notes.tool.tsx:21`（listNotes 工厂）

## 集成方式（与会话接通）

推荐直接复用现有工厂：

```tsx
import { useAgentSessionManager, useParseTools, AgentChatCore } from "@agent-labs/agent-chat";
import { aiAgentFactory } from "@/common/features/ai-assistant/services/ai-agent-factory";

function NotesChat({ conversationId, channelId }: { conversationId: string; channelId: string }) {
  const tools = useMemo(() => aiAgentFactory.getChannelTools(channelId), [channelId]);
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);
  const agent = useMemo(() => aiAgentFactory.getAgent(), []);

  const session = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: () => aiAgentFactory.getSessionContexts(conversationId, channelId),
    initialMessages: [],
    getToolExecutor: name => toolExecutors[name],
  });

  return <AgentChatCore agentSessionManager={session} toolRenderers={toolRenderers} />;
}
```

实际工程用法可参考：`src/common/features/ai-assistant/components/ai-conversation-chat.tsx:108`

## 三种形态对照（结合笔记工具）

与教程一致，我们区分三类工具。项目内的笔记工具主要属于“前端执行 + 默认渲染”，我们建议为关键场景补充更友好的渲染器。

- 后端执行（Backend-Only）：仅 render（或使用默认渲染），不实现 execute；由后端产生结果。
- 前端执行 + 渲染（Frontend-Execution + Render）：既有 execute，也有 render；我们可以在执行前后展示更好的状态与结果。
- 纯交互（User-Interaction）：只提供 UI 收集用户操作，通过 onResult 回传。

### 示例 A：createNote（前端执行 + 默认渲染）

工具定义见 src/common/features/ai-assistant/services/channel-tools-manager.ts:23。最简使用下无需自定义渲染器，默认 ToolCallRenderer 会在“执行中/结果”阶段给出占位展示。

```tsx
const tools = [
  {
    name: "createNote",
    description: "Create a new note in current channel",
    parameters: {
      type: "object",
      properties: { content: { type: "string" } },
      required: ["content"],
    },
    execute: async toolCall => {
      const { content } = JSON.parse(toolCall.function.arguments);
      // 实际逻辑：写入当前频道
      return {
        toolCallId: toolCall.id,
        result: `Created: ${content.slice(0, 50)}...`,
        state: "result" as const,
      };
    },
  },
];
```

提示：如果希望在 UI 中同步显示“已插入到时间线”的视觉反馈，可追加一个轻量 render，用于非 result 阶段提示“正在写入…”。

### 示例 B：listNotes（前端执行 + 自定义渲染，推荐）

当前实现既有 execute 又有一个极简 render（只提示“Listing …”）。结合教程的思路，我们可以覆盖渲染器，在参数阶段给出提示，在结果阶段以列表方式展示内容。

```tsx
// 基于 useParseTools 的返回，覆盖同名渲染器
const { toolDefs, toolExecutors, toolRenderers: baseRenderers } = useParseTools(tools);

const toolRenderers = {
  ...baseRenderers,
  listNotes: {
    definition: toolDefs.find(d => d.name === "listNotes")!,
    render: invocation => {
      if (invocation.state !== "result") {
        const args =
          typeof invocation.args === "string" ? invocation.args : JSON.stringify(invocation.args);
        return (
          <div className="p-3 border rounded-md text-sm text-muted-foreground">
            正在读取笔记列表… 参数：{args}
          </div>
        );
      }
      // 现有 execute 返回的是字符串化的数组，这里还原后展示
      let items: Array<{ noteId: string; content: string; timestampReadable: string }>;
      try {
        items = JSON.parse(String(invocation.result));
      } catch {
        return (
          <pre className="text-xs whitespace-pre-wrap break-all">{String(invocation.result)}</pre>
        );
      }
      return (
        <div className="p-3 border rounded-md bg-muted/20">
          <div className="text-sm font-medium mb-2">最近笔记</div>
          <ul className="space-y-1">
            {items.map(it => (
              <li key={it.noteId} className="text-sm">
                <span className="text-muted-foreground">[{it.timestampReadable}]</span>
                <span className="ml-2">{it.content}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    },
  },
};
```

注意：如需更进一步的交互（比如“跳转到该笔记”），可以在 li 中加入按钮，触发应用内的跳转逻辑。

### 示例 C：updateNote（纯交互变体，按需启用）

现有实现是“直接更新并返回结果”的前端执行工具。如果你希望 A I 在“准备参数”后交给用户确认再更新，可以改造成“纯交互”形态：

```tsx
const updateNoteInteractive = {
  name: "updateNote",
  description: "Update note after user confirmation",
  parameters: {
    type: "object",
    properties: { noteId: { type: "string" }, content: { type: "string" } },
    required: ["noteId", "content"],
  },
  render: (invocation, onResult) => {
    const { noteId, content } =
      typeof invocation.args === "string" ? JSON.parse(invocation.args) : (invocation.args as any);
    return (
      <div className="p-3 border rounded-md text-sm">
        <div className="mb-2">
          确认更新笔记 <code>{noteId}</code> 吗？
        </div>
        <pre className="text-xs whitespace-pre-wrap break-all mb-2">{content}</pre>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={() =>
              onResult({ toolCallId: invocation.toolCallId, result: "confirmed", state: "result" })
            }
          >
            确认
          </button>
          <button
            className="px-3 py-1 rounded"
            onClick={() =>
              onResult({ toolCallId: invocation.toolCallId, result: "cancelled", state: "result" })
            }
          >
            取消
          </button>
        </div>
      </div>
    );
  },
};
```

实际是否启用“纯交互”取决于产品策略；对批量/危险操作建议采用交互确认。

## 触发文案建议（便于模型调用正确的工具）

- 创建：”在本频道记一条：……“、”帮我记录…“（明确内容）
- 查看：”把 ID=xxx 的笔记打开/读出来“
- 更新：”把那条笔记（ID=xxx）内容改为…“
- 删除：”删除 ID=xxx 这条笔记“（建议二次确认）
- 列表：”列出这个频道最近 10 条笔记“、”看看最近的记录“

## 实用提示

- 使用默认渲染器可以快速接入；在关键场景（如 listNotes）增加自定义 render，可显著提升可读性。
- 执行阶段分为 `partial-call` / `call` / `result`，可参考教程中的“流式参数预览”策略提前给出 UI 反馈。
- 当前 `listNotes` 的执行结果为字符串化 JSON，渲染器中需要 `JSON.parse` 再展示；按需可把结果改为对象以减少解析。
- 参考：docs/references/agent-chat/agent-chat-tutorial.md 的三种工具形态与流式渲染示例。
