# 空间感知AI聊天功能

## 功能概述

这是一个简单直接的agent能力，能够感知指定空间的所有记录，并基于这些上下文信息与AI进行智能对话。

## 核心特性

### 🎯 空间感知

- 自动获取指定空间的所有记录
- 理解记录内容和标签
- 提供空间摘要和统计信息

### 💬 智能对话

- 基于空间上下文进行对话
- 无需重复解释背景信息
- 支持自然语言查询

### 🔍 内容分析

- 自动总结空间内容
- 分析进度和状态
- 提供建议和改进方向

## 使用方法

### 基础用法

```tsx
import { SpaceAwareChat } from "@/common/features/space-aware-chat";

function MyComponent() {
  return <SpaceAwareChat spaceId="work" placeholder="询问关于工作空间的问题..." />;
}
```

### 高级用法

```tsx
import { useSpaceRecords, useSpaceAIChat } from "@/common/features/space-aware-chat";

function CustomChat() {
  const spaceContext = useSpaceRecords("work");
  const { messages, sendMessage, isLoading } = useSpaceAIChat("work", spaceContext);

  return <div>{/* 自定义UI */}</div>;
}
```

## 组件结构

```
space-aware-chat/
├── index.ts                    # 主入口
├── types.ts                    # 类型定义
├── space-aware-chat.tsx        # 主组件
├── hooks/
│   ├── use-space-records.ts    # 空间记录hook
│   └── use-space-ai-chat.ts   # AI聊天hook
├── components/
│   ├── space-context-display.tsx  # 空间上下文显示
│   ├── chat-message.tsx           # 聊天消息
│   └── chat-input.tsx             # 聊天输入
└── README.md                   # 说明文档
```

## 数据流

```
用户选择空间 → 获取空间记录 → 构建上下文 → AI对话 → 显示结果
```

## 扩展点

### 1. 真实AI集成

替换 `use-space-ai-chat.ts` 中的模拟AI逻辑：

```tsx
// 替换模拟AI调用
const aiResponse = await openaiClient.chat({
  messages: [
    { role: "system", content: `基于以下空间记录进行对话：\n${context}` },
    { role: "user", content: userMessage },
  ],
});
```

### 2. 数据源集成

替换 `use-space-records.ts` 中的模拟数据：

```tsx
// 从真实store获取数据
const records = useMessageStore(state => state.messages.filter(msg => msg.spaceId === spaceId));
```

### 3. 自定义UI

可以只使用hooks，自定义UI组件：

```tsx
const { messages, sendMessage } = useSpaceAIChat(spaceId, spaceContext);

// 自定义消息列表
<div className="custom-messages">
  {messages.map(msg => (
    <CustomMessage key={msg.id} message={msg} />
  ))}
</div>;
```

## 设计原则

### 简单直接

- 最小化抽象层次
- 清晰的组件职责
- 直观的API设计

### 可扩展性

- 模块化组件设计
- 灵活的hook系统
- 支持自定义UI

### 类型安全

- 完整的TypeScript类型定义
- 运行时类型检查
- 开发时智能提示

## 使用场景

### 工作空间

- 项目进度查询
- 任务状态分析
- 工作总结和建议

### 学习空间

- 知识体系构建
- 学习进度跟踪
- 复习建议和计划

### 个人空间

- 生活习惯分析
- 目标管理
- 生活建议

## 注意事项

1. **性能考虑**：大量记录时考虑分页加载
2. **AI成本**：真实AI集成时注意API调用成本
3. **数据隐私**：确保敏感信息不被泄露
4. **离线支持**：考虑网络不可用时的降级方案

## 未来改进

- [ ] 支持多空间联合查询
- [ ] 添加对话历史持久化
- [ ] 支持文件附件和图片
- [ ] 添加语音输入支持
- [ ] 支持多语言对话
