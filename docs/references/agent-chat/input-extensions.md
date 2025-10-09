# Input Extensions 文档

## 概述

Input Extensions 是 `@agent-labs/agent-chat` 库的核心扩展系统，允许开发者通过插件化的方式为聊天输入组件添加自定义功能。这个系统提供了灵活的架构，支持多种输入方式和交互模式。

## 核心概念

### ChatInputExtension

`ChatInputExtension` 是扩展的核心接口，定义了扩展的基本结构和行为：

```typescript
interface ChatInputExtension {
  id: string; // 唯一标识符
  placement?: ChatInputExtensionPlacement; // 扩展位置
  render: (ctx: ChatInputExtensionContext) => React.ReactNode; // 渲染函数
  beforeSend?: (
    draft: ComposerDraft
  ) => Promise<ComposerDraft | { abort: true }> | ComposerDraft | { abort: true }; // 发送前处理
}
```

### 扩展位置 (Placement)

系统支持多种扩展位置，适应不同的UI需求：

```typescript
type ChatInputExtensionPlacement =
  | "inside-left" // 输入框内部左侧（适合简单图标）
  | "inside-right" // 输入框内部右侧（靠近发送按钮）
  | "top-left" // 头部工具栏左侧（适合工具按钮）
  | "top-right" // 头部工具栏右侧
  | "bottom-left" // 底部工具栏左侧（适合模型选择）
  | "bottom-right" // 底部工具栏右侧（适合计数器、成本显示）
  | "below" // 输入框下方（已废弃，映射到bottom-left）
  | "above" // 输入框上方（已废弃）
  | "toolbar-left" // 工具栏左侧（已废弃，映射到top-left）
  | "toolbar-right"; // 工具栏右侧（已废弃，映射到top-right）
```

### 扩展上下文 (Context)

每个扩展在渲染时都会接收到上下文信息：

```typescript
interface ChatInputExtensionContext {
  draft: ComposerDraft; // 当前输入草稿
  setDraft: (next: ComposerDraft | ((d: ComposerDraft) => ComposerDraft)) => void; // 更新草稿
  isAgentResponding: boolean; // 是否正在响应
  requestAbort?: () => void; // 请求中止函数
}
```

### 草稿对象 (ComposerDraft)

草稿对象包含输入文本和元数据：

```typescript
interface ComposerDraft {
  text: string; // 输入文本
  meta?: Record<string, unknown>; // 元数据（如模型ID、文件等）
}
```

## 使用方法

### 基本用法

```typescript
import { EnhancedMessageInput } from '@agent-labs/agent-chat'

const MyExtension: ChatInputExtension = {
  id: 'my-extension',
  placement: 'bottom-left',
  render: ({ draft, setDraft, isAgentResponding }) => (
    <button onClick={() => setDraft({ ...draft, text: draft.text + 'Hello!' })}>
      Add Hello
    </button>
  )
}

function MyComponent() {
  return (
    <EnhancedMessageInput
      input={input}
      onInputChange={setInput}
      onSend={handleSend}
      inputExtensions={[MyExtension]}
    />
  )
}
```

### 使用工厂函数

推荐使用工厂函数创建扩展，提供更好的类型安全和默认值：

```typescript
interface MyExtensionProps {
  onAction?: (value: string) => void
  className?: string
}

export const createMyExtension = (props: MyExtensionProps): ChatInputExtension => ({
  id: 'my-extension',
  placement: 'bottom-left',
  render: ({ draft, setDraft }) => (
    <MyExtensionComponent
      {...props}
      onAction={(value) => {
        setDraft({ ...draft, text: draft.text + value })
        props.onAction?.(value)
      }}
    />
  )
})
```

## 内置扩展

### 语音输入扩展

```typescript
import { createVoiceInputExtension } from "./extensions";

const voiceExtension = createVoiceInputExtension({
  onVoiceResult: text => {
    console.log("语音识别结果:", text);
  },
});
```

**功能特性：**

- 支持浏览器原生语音录制
- 自动处理权限请求
- 可自定义回调函数
- 响应式UI状态

### 文件上传扩展

```typescript
import { createFileUploadExtension } from "./extensions";

const fileExtension = createFileUploadExtension({
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFileTypes: ["image/*", ".pdf", ".txt"],
  onFileUpload: files => {
    console.log("上传文件:", files);
  },
});
```

**功能特性：**

- 支持拖拽上传
- 文件类型和大小限制
- 多文件选择
- 可自定义回调

### 表情选择扩展

```typescript
import { createEmojiExtension } from "./extensions";

const emojiExtension = createEmojiExtension({
  onEmojiSelect: emoji => {
    console.log("选择表情:", emoji);
  },
});
```

**功能特性：**

- 内置常用表情
- 点击插入到输入框
- 可自定义表情列表

## 高级用法

### 发送前处理

使用 `beforeSend` 钩子可以在发送前处理数据：

```typescript
const processingExtension: ChatInputExtension = {
  id: 'processing',
  placement: 'bottom-right',
  render: () => <span>Processing...</span>,
  beforeSend: async (draft) => {
    // 异步处理
    const processedText = await processText(draft.text)
    return { ...draft, text: processedText }
  }
}
```

### 条件渲染

根据状态条件渲染扩展：

```typescript
const conditionalExtension: ChatInputExtension = {
  id: 'conditional',
  placement: 'top-left',
  render: ({ isAgentResponding }) => {
    if (isAgentResponding) {
      return <div>AI正在思考...</div>
    }
    return <button>开始对话</button>
  }
}
```

### 元数据管理

使用 `meta` 字段存储扩展相关数据：

```typescript
const modelSelectorExtension: ChatInputExtension = {
  id: 'model-selector',
  placement: 'bottom-left',
  render: ({ draft, setDraft }) => (
    <select
      value={draft.meta?.modelId || 'gpt-4'}
      onChange={(e) => {
        setDraft({
          ...draft,
          meta: { ...draft.meta, modelId: e.target.value }
        })
      }}
    >
      <option value="gpt-4">GPT-4</option>
      <option value="gpt-3.5">GPT-3.5</option>
    </select>
  )
}
```

## 最佳实践

### 1. 命名规范

- 使用描述性的 `id`，如 `voice-input`、`file-upload`
- 保持扩展名称简洁明了

### 2. 位置选择

- `inside-left/right`：适合简单图标按钮
- `top-left/right`：适合工具栏功能
- `bottom-left/right`：适合设置和状态显示

### 3. 性能优化

- 使用 `useCallback` 和 `useMemo` 优化渲染
- 避免在 `render` 函数中创建新对象
- 合理使用条件渲染

### 4. 错误处理

```typescript
const robustExtension: ChatInputExtension = {
  id: 'robust',
  placement: 'bottom-left',
  render: ({ draft, setDraft }) => {
    try {
      return <MyComponent draft={draft} setDraft={setDraft} />
    } catch (error) {
      console.error('Extension error:', error)
      return <div>Error loading extension</div>
    }
  }
}
```

### 5. 类型安全

```typescript
interface MyExtensionProps {
  onAction: (value: string) => void;
  className?: string;
}

export const createMyExtension = (props: MyExtensionProps): ChatInputExtension => {
  // 实现
};
```

## 常见问题

### Q: 如何确保扩展在正确的时机渲染？

A: 使用 `placement` 属性指定位置，系统会自动处理渲染时机。

### Q: 扩展之间如何通信？

A: 通过 `draft.meta` 字段共享数据，或者使用外部状态管理。

### Q: 如何处理异步操作？

A: 使用 `beforeSend` 钩子处理异步操作，或者使用 `useState` 管理异步状态。

### Q: 扩展样式如何自定义？

A: 在扩展组件中使用 `className` 属性，或者使用内联样式。

## 示例项目

查看 `playground` 目录中的示例：

- `src/extensions/` - 扩展实现
- `src/features/enhanced-input-demo/` - 基础使用示例
- `src/features/agent-chat-window-demo/` - 完整聊天窗口示例

## API 参考

### ChatInputExtension

| 属性         | 类型                                                                                                      | 必需 | 描述                           |
| ------------ | --------------------------------------------------------------------------------------------------------- | ---- | ------------------------------ |
| `id`         | `string`                                                                                                  | ✅   | 扩展唯一标识符                 |
| `placement`  | `ChatInputExtensionPlacement`                                                                             | ❌   | 扩展位置，默认为 `bottom-left` |
| `render`     | `(ctx: ChatInputExtensionContext) => React.ReactNode`                                                     | ✅   | 渲染函数                       |
| `beforeSend` | `(draft: ComposerDraft) => Promise<ComposerDraft \| { abort: true }> \| ComposerDraft \| { abort: true }` | ❌   | 发送前处理函数                 |

### ChatInputExtensionContext

| 属性                | 类型                                                                     | 描述                 |
| ------------------- | ------------------------------------------------------------------------ | -------------------- |
| `draft`             | `ComposerDraft`                                                          | 当前输入草稿         |
| `setDraft`          | `(next: ComposerDraft \| ((d: ComposerDraft) => ComposerDraft)) => void` | 更新草稿函数         |
| `isAgentResponding` | `boolean`                                                                | 是否正在响应         |
| `requestAbort`      | `() => void`                                                             | 请求中止函数（可选） |

### ComposerDraft

| 属性   | 类型                      | 描述           |
| ------ | ------------------------- | -------------- |
| `text` | `string`                  | 输入文本       |
| `meta` | `Record<string, unknown>` | 元数据（可选） |
