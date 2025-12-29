# StillRoot 系统架构模式

## 整体架构设计

### 架构原则

- **组件化设计** - 高度模块化的组件架构
- **状态集中管理** - 使用Zustand进行全局状态管理
- **类型安全** - 全面的TypeScript类型定义
- **响应式设计** - 移动端优先的UI设计
- **性能优化** - 虚拟滚动、懒加载等性能优化

### 架构层次

```
┌─────────────────────────────────────┐
│            UI Layer                 │  ← 用户界面层
├─────────────────────────────────────┤
│         Component Layer             │  ← 组件层
├─────────────────────────────────────┤
│          Hook Layer                 │  ← 业务逻辑层
├─────────────────────────────────────┤
│         Store Layer                 │  ← 状态管理层
├─────────────────────────────────────┤
│         Service Layer               │  ← 服务层
├─────────────────────────────────────┤
│         Storage Layer               │  ← 数据存储层
└─────────────────────────────────────┘
```

## 核心模块设计

### 1. 消息系统模块

#### 消息数据结构

```typescript
interface Message {
  id: string;
  content: string;
  type: "text" | "image" | "file" | "ai";
  sender: "user" | "ai" | "system";
  timestamp: number;
  channelId: string;
  tags: string[];
  metadata?: {
    fileSize?: number;
    fileName?: string;
    aiModel?: string;
  };
}
```

#### 消息组件架构

```
MessageList/
├── MessageList.tsx          # 消息列表容器
├── MessageItem.tsx          # 单个消息项
├── MessageBubble.tsx        # 消息气泡
├── MessageInput.tsx         # 消息输入框
├── MessageActions.tsx       # 消息操作按钮
└── types/
    └── message.types.ts     # 消息相关类型
```

### 2. 频道系统模块

#### 频道数据结构

```typescript
interface Channel {
  id: string;
  name: string;
  description?: string;
  type: "personal" | "work" | "study" | "custom";
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  isArchived: boolean;
}
```

#### 频道组件架构

```
ChannelManager/
├── ChannelList.tsx          # 频道列表
├── ChannelItem.tsx          # 频道项
├── ChannelCreator.tsx       # 频道创建器
├── ChannelSettings.tsx      # 频道设置
└── types/
    └── channel.types.ts     # 频道相关类型
```

### 3. AI集成模块

#### AI服务架构

```
AIService/
├── ai-client.service.ts     # AI API客户端
├── ai-message-processor.ts  # AI消息处理器
├── ai-stream-handler.ts     # 流式响应处理器
├── ai-prompt-manager.ts     # 提示词管理
└── types/
    └── ai.types.ts          # AI相关类型
```

#### AI功能设计

- **智能回复** - 基于上下文生成回复
- **内容总结** - 自动总结长文本内容
- **标签生成** - 自动为消息生成标签
- **内容分类** - 智能分类消息内容

### 4. 标签系统模块

#### 标签数据结构

```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
  createdAt: number;
}

interface TaggedMessage {
  messageId: string;
  tagIds: string[];
}
```

#### 标签组件架构

```
TagSystem/
├── TagList.tsx              # 标签列表
├── TagItem.tsx              # 标签项
├── TagFilter.tsx            # 标签过滤器
├── TagManager.tsx           # 标签管理器
└── types/
    └── tag.types.ts         # 标签相关类型
```

## 状态管理设计

### Zustand Store架构

#### 主Store结构

```typescript
interface AppState {
  // 用户状态
  user: UserState;

  // 频道状态
  channels: ChannelState;

  // 消息状态
  messages: MessageState;

  // 标签状态
  tags: TagState;

  // UI状态
  ui: UIState;

  // 设置状态
  settings: SettingsState;
}
```

#### Store模块化

```
stores/
├── index.ts                 # Store入口
├── user-store.ts           # 用户状态
├── channel-store.ts        # 频道状态
├── message-store.ts        # 消息状态
├── tag-store.ts            # 标签状态
├── ui-store.ts             # UI状态
├── settings-store.ts       # 设置状态
└── types/
    └── store.types.ts      # Store类型定义
```

### 状态持久化策略

- **用户设置** - LocalStorage持久化
- **频道数据** - IndexedDB持久化
- **消息数据** - IndexedDB持久化
- **标签数据** - IndexedDB持久化

## 数据流设计

### 单向数据流

```
用户操作 → 组件事件 → Hook处理 → Store更新 → 状态同步 → UI更新
```

### 异步数据流

```
API请求 → Service处理 → Store更新 → 状态同步 → UI更新
```

### 数据同步策略

- **实时同步** - 用户操作立即同步到Store
- **批量同步** - 大量数据批量同步到存储
- **离线同步** - 离线时本地存储，上线后同步

## 组件设计模式

### 1. 容器组件模式

```typescript
// 容器组件负责状态管理和业务逻辑
const MessageListContainer = () => {
  const messages = useMessageStore();
  const { loadMessages, sendMessage } = useMessageActions();

  return <MessageList messages={messages} onSend={sendMessage} />;
};
```

### 2. 展示组件模式

```typescript
// 展示组件只负责UI渲染
interface MessageListProps {
  messages: Message[];
  onSend: (content: string) => void;
}

const MessageList = ({ messages, onSend }: MessageListProps) => {
  return (
    <div className="message-list">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
```

### 3. 自定义Hook模式

```typescript
// 业务逻辑封装在自定义Hook中
const useMessageActions = () => {
  const { addMessage, updateMessage } = useMessageStore();

  const sendMessage = useCallback(
    async (content: string) => {
      const message = createMessage(content);
      addMessage(message);

      if (content.startsWith("@AI")) {
        const aiResponse = await sendToAI(content);
        addMessage(aiResponse);
      }
    },
    [addMessage]
  );

  return { sendMessage };
};
```

## 性能优化模式

### 1. 虚拟滚动

```typescript
// 长列表使用虚拟滚动
const VirtualMessageList = () => {
  return (
    <VirtualList
      items={messages}
      itemHeight={80}
      renderItem={(message) => <MessageItem message={message} />}
    />
  );
};
```

### 2. 组件记忆化

```typescript
// 使用React.memo优化渲染
const MessageItem = React.memo(({ message }: MessageItemProps) => {
  return <div className="message-item">{message.content}</div>;
});
```

### 3. 懒加载

```typescript
// 大型组件懒加载
const LazyChannelSettings = lazy(() => import("./ChannelSettings"));
```

## 错误处理模式

### 1. 错误边界

```typescript
// 组件级错误处理
class MessageErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage />;
    }
    return this.props.children;
  }
}
```

### 2. 异步错误处理

```typescript
// API调用错误处理
const useMessageActions = () => {
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        const message = await createMessage(content);
        addMessage(message);
      } catch (error) {
        showError("发送消息失败");
        logError(error);
      }
    },
    [addMessage]
  );
};
```
