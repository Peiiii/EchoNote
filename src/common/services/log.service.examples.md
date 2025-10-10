# LogService 埋点使用示例

## 概述

LogService 为 StillRoot 应用提供了全面的用户行为分析和性能监控埋点。本文档展示了如何在各个功能模块中正确使用这些埋点方法。

## 基础使用

```typescript
import { logService, Platform, MessageType, ChannelEditField } from '@/common/services/log.service';

// 基础事件记录
logService.logEvent('custom_event', {
  custom_param: 'value',
  numeric_param: 123
});
```

## 功能模块埋点示例

### 1. 应用生命周期

```typescript
import { logService, Platform } from '@/common/services/log.service';

// 应用启动
useEffect(() => {
  logService.logAppStart(Platform.DESKTOP, '1.0.0');
}, []);

// 应用关闭
useEffect(() => {
  const startTime = Date.now();
  return () => {
    const sessionDuration = Date.now() - startTime;
    logService.logAppClose(sessionDuration);
  };
}, []);
```

### 2. 频道管理

```typescript
import { logService, ChannelEditField } from '@/common/services/log.service';

// 频道创建
const handleCreateChannel = (channelData: ChannelData) => {
  const newChannel = createChannel(channelData);
  logService.logChannelCreate(
    newChannel.id,
    newChannel.name,
    !!newChannel.description
  );
};

// 频道选择
const handleChannelSelect = (channel: Channel) => {
  setCurrentChannel(channel.id);
  logService.logChannelSelect(
    channel.id,
    channel.name,
    channel.messageCount
  );
};

// 频道编辑
const handleChannelEdit = (channelId: string, field: ChannelEditField) => {
  logService.logChannelEdit(channelId, field);
};

// 频道删除
const handleChannelDelete = (channel: Channel) => {
  logService.logChannelDelete(
    channel.id,
    channel.name,
    channel.messageCount
  );
  deleteChannel(channel.id);
};
```

### 3. 消息操作

```typescript
import { logService, MessageType } from '@/common/services/log.service';

// 发送消息
const handleSendMessage = (content: string, channelId: string) => {
  const messageType = detectMessageType(content);
  const hasTags = content.includes('#');
  
  logService.logMessageSend(
    channelId,
    messageType,
    content.length,
    hasTags
  );
  
  sendMessage(content);
};

// 编辑消息
const handleEditMessage = (messageId: string, channelId: string, editCount: number) => {
  logService.logMessageEdit(messageId, channelId, editCount);
  updateMessage(messageId, newContent);
};

// 删除消息
const handleDeleteMessage = (message: Message) => {
  const messageAge = Date.now() - message.timestamp;
  logService.logMessageDelete(
    message.id,
    message.channelId,
    messageAge
  );
  deleteMessage(message.id);
};

// 回复消息
const handleReplyMessage = (messageId: string, channelId: string, threadId: string) => {
  logService.logMessageReply(messageId, channelId, threadId);
  openThread(messageId);
};
```

### 4. AI助手交互

```typescript
import { logService, AITrigger, ContextMode } from '@/common/services/log.service';

// 打开AI助手
const handleOpenAIAssistant = (channelId: string, trigger: AITrigger) => {
  logService.logAIAssistantOpen(channelId, trigger);
  setAIAssistantOpen(true);
};

// 关闭AI助手
const handleCloseAIAssistant = (channelId: string, sessionDuration: number, messageCount: number) => {
  logService.logAIAssistantClose(channelId, sessionDuration, messageCount);
  setAIAssistantOpen(false);
};

// 发送AI消息
const handleSendAIMessage = (message: string, channelId: string, contextMode: ContextMode) => {
  logService.logAIMessageSend(
    channelId,
    message.length,
    contextMode
  );
  sendAIMessage(message);
};

// 接收AI回复
const handleReceiveAIResponse = (response: string, channelId: string, responseTime: number, toolUsed: boolean) => {
  logService.logAIMessageReceive(
    channelId,
    response.length,
    responseTime,
    toolUsed
  );
};

// AI工具使用
const handleAIToolUse = (toolName: string, channelId: string, success: boolean) => {
  logService.logAIToolUse(toolName, channelId, success);
};
```

### 5. 线程管理

```typescript
// 打开线程
const handleOpenThread = (messageId: string, channelId: string, threadCount: number) => {
  logService.logThreadOpen(messageId, channelId, threadCount);
  setThreadOpen(true);
};

// 关闭线程
const handleCloseThread = (messageId: string, channelId: string, sessionDuration: number) => {
  logService.logThreadClose(messageId, channelId, sessionDuration);
  setThreadOpen(false);
};

// 线程回复
const handleThreadReply = (messageId: string, channelId: string, threadId: string) => {
  logService.logThreadReply(messageId, channelId, threadId);
  sendThreadReply(content);
};
```

### 6. 搜索功能

```typescript
// 开始搜索
const handleSearchStart = (query: string, channelId?: string) => {
  logService.logSearchStart(query, channelId);
  performSearch(query, channelId);
};

// 搜索结果
const handleSearchResult = (query: string, results: SearchResult[], channelId?: string) => {
  logService.logSearchResult(query, results.length, channelId);
  displaySearchResults(results);
};

// 选择搜索结果
const handleSearchSelect = (query: string, resultIndex: number, channelId?: string) => {
  logService.logSearchSelect(query, resultIndex, channelId);
  navigateToResult(results[resultIndex]);
};
```

### 7. 界面交互

```typescript
import { logService, SidebarType, SidebarAction, InputAction } from '@/common/services/log.service';

// 侧边栏切换
const handleSidebarToggle = (sidebar: SidebarType, action: SidebarAction) => {
  logService.logSidebarToggle(sidebar, action);
  toggleSidebar(sidebar, action === SidebarAction.OPEN);
};

// 输入框折叠
const handleInputCollapse = (action: InputAction) => {
  logService.logInputCollapse(action);
  setInputCollapsed(action === InputAction.COLLAPSE);
};

// 滚动到底部
const handleScrollToBottom = (channelId: string, messageCount: number) => {
  logService.logScrollToBottom(channelId, messageCount);
  scrollToBottom();
};

// 消息展开
const handleMessageExpand = (messageId: string, channelId: string, contentLength: number) => {
  logService.logMessageExpand(messageId, channelId, contentLength);
  expandMessage(messageId);
};
```

### 8. 设置和偏好

```typescript
import { logService, Theme, ContextMode } from '@/common/services/log.service';

// 打开设置
const handleSettingsOpen = (channelId?: string) => {
  logService.logSettingsOpen(channelId);
  setSettingsOpen(true);
};

// 主题切换
const handleThemeChange = (theme: Theme) => {
  logService.logThemeChange(theme);
  setTheme(theme);
};

// 上下文模式切换
const handleContextModeChange = (mode: ContextMode, channelId?: string) => {
  logService.logContextModeChange(mode, channelId);
  setContextMode(mode);
};
```

### 9. 性能监控

```typescript
import { logService, Platform } from '@/common/services/log.service';

// 页面加载
const handlePageLoad = (page: string, loadTime: number, platform: Platform) => {
  logService.logPageLoad(page, loadTime, platform);
};

// 消息加载
const handleMessageLoad = (channelId: string, messageCount: number, loadTime: number) => {
  logService.logMessageLoad(channelId, messageCount, loadTime);
};

// 虚拟化性能
const handleVirtualizationPerformance = (
  channelId: string,
  visibleCount: number,
  totalCount: number,
  renderTime: number
) => {
  logService.logVirtualizationPerformance(channelId, visibleCount, totalCount, renderTime);
};
```

### 10. 错误监控

```typescript
// 通用错误
const handleError = (error: Error, component: string, channelId?: string) => {
  logService.logError(
    error.constructor.name,
    error.message,
    component,
    channelId
  );
};

// AI失败
const handleAIFailure = (channelId: string, errorType: string, retryCount: number) => {
  logService.logAIFailure(channelId, errorType, retryCount);
};
```

### 11. 用户参与度

```typescript
// 每日活跃
const handleDailyActive = () => {
  const messageCount = getTotalMessageCount();
  const channelCount = getChannelCount();
  const aiUsageCount = getAIUsageCount();
  
  logService.logDailyActive(messageCount, channelCount, aiUsageCount);
};

// 会话指标
const handleSessionMetrics = () => {
  const sessionDuration = getSessionDuration();
  const messageCount = getSessionMessageCount();
  const aiInteractionCount = getAIInteractionCount();
  const channelCount = getChannelCount();
  
  logService.logSessionMetrics(
    sessionDuration,
    messageCount,
    aiInteractionCount,
    channelCount
  );
};
```

### 12. 功能使用统计

```typescript
import { logService, ExportFormat, TagAction } from '@/common/services/log.service';

// 功能使用
const handleFeatureUsage = (feature: string, action: string, channelId?: string) => {
  logService.logFeatureUsage(feature, action, channelId);
};

// 导出功能
const handleExport = (format: ExportFormat, channelId: string, messageCount: number) => {
  logService.logExport(format, channelId, messageCount);
  performExport(format, channelId);
};

// 标签使用
const handleTagUse = (tag: string, channelId: string, action: TagAction) => {
  logService.logTagUse(tag, channelId, action);
};

// 快捷键使用
const handleHotkeyUse = (hotkey: string, context: string) => {
  logService.logHotkeyUse(hotkey, context);
};
```

### 13. 移动端特定

```typescript
import { logService, MobileGesture } from '@/common/services/log.service';

// 移动端手势
const handleMobileGesture = (gesture: MobileGesture, action: string) => {
  logService.logMobileGesture(gesture, action);
};
```

### 14. PWA相关

```typescript
// PWA安装
const handlePWAInstall = (platform: string) => {
  logService.logPWAInstall(platform);
};

// PWA更新
const handlePWAUpdate = (version: string) => {
  logService.logPWAUpdate(version);
};
```

### 15. 批量操作

```typescript
// 批量操作
const handleBatchOperation = (operation: string, itemCount: number, channelId: string) => {
  logService.logBatchOperation(operation, itemCount, channelId);
  performBatchOperation(operation, items);
};
```

### 16. 用户反馈

```typescript
import { logService, FeedbackType } from '@/common/services/log.service';

// 用户反馈
const handleFeedback = (type: FeedbackType, rating: number, channelId?: string) => {
  logService.logFeedback(type, rating, channelId);
};
```

## 最佳实践

### 1. 埋点时机
- 在用户操作完成后立即记录埋点
- 避免在异步操作开始前记录埋点
- 确保埋点数据准确反映用户行为

### 2. 参数设计
- 使用有意义的参数名称
- 保持参数类型一致
- 避免记录敏感信息

### 3. 性能考虑
- 埋点操作应该是非阻塞的
- 避免在高频操作中记录过多埋点
- 考虑批量发送埋点数据

### 4. 错误处理
- 埋点失败不应影响主要功能
- 记录埋点错误到控制台
- 提供降级方案

### 5. 隐私保护
- 不记录用户敏感信息
- 遵循数据保护法规
- 提供用户控制选项

## 注意事项

1. **类型安全**: 所有埋点参数都应该有明确的类型定义
2. **性能影响**: 埋点操作应该尽可能轻量
3. **数据准确性**: 确保埋点数据准确反映用户行为
4. **隐私合规**: 遵循相关隐私保护法规
5. **可维护性**: 保持埋点代码的可读性和可维护性
