# 聊天消息加载重构方案

## 📋 目标

重构消息加载机制，解决当前订阅+分页混合模式的问题，实现更清晰的职责分离。

## 🎯 设计原则

1. **职责分离**：初始加载、实时更新、历史分页各司其职
2. **用户体验**：查看历史消息时不被新消息打断
3. **简单维护**：逻辑清晰，易于调试

## 🏗️ 架构设计

### 当前问题

```typescript
// ❌ 混合模式
subscribeToChannelMessages(...) // 初始+实时
fetchMoreMessages(...)           // 分页
```

### 新架构

```typescript
// ✅ 分离模式
fetchInitialMessages(...)        // 初始加载
subscribeToNewMessages(...)      // 实时新消息
fetchHistoryMessages(...)        // 历史分页
```

## 📦 实现计划

### Hook 设计

```typescript
const useChannelMessages = (channelId: string) => {
  // 1. 初始消息（最新20条）
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);

  // 2. 新消息（实时订阅）
  const [newMessages, setNewMessages] = useState<Message[]>([]);

  // 3. 历史消息（分页获取）
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);

  // 4. 合并所有消息
  const allMessages = useMemo(
    () => [...historyMessages, ...initialMessages, ...newMessages],
    [historyMessages, initialMessages, newMessages]
  );

  return {
    messages: allMessages,
    loading,
    hasMoreHistory,
    loadMoreHistory,
    refresh,
  };
};
```

### 数据流

```
1. 进入频道 → fetchInitialMessages() → 获取最新20条
2. 页面底部 → subscribeToNewMessages() → 实时监听新消息
3. 向上滚动 → fetchHistoryMessages() → 分页加载历史
```

## 🔧 实现步骤

### Step 1: 修改 Firebase 服务

- 保留 `fetchInitialMessages()`
- 保留 `fetchMoreMessages()`
- 新增 `subscribeToNewMessages(timestamp)`

### Step 2: 创建新 Hook

- 创建 `useChannelMessages()`
- 替换现有的 `usePaginatedMessages()`

### Step 3: 更新组件

- 修改 `TimelineContent` 使用新 Hook
- 保持懒加载逻辑不变

## ✅ 预期效果

- 🚀 性能：减少不必要的订阅和查询
- 🎯 体验：历史消息浏览不被打断
- 🔧 维护：逻辑清晰，易于扩展
