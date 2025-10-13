# LogService 枚举使用指南

## 概述

LogService 使用枚举来统一管理所有埋点事件名称和参数值，确保类型安全和代码一致性。

## 枚举列表

### 1. AnalyticsEvent - 埋点事件名称

```typescript
export enum AnalyticsEvent {
  APP_START = 'app_start',
  APP_CLOSE = 'app_close',
  CHANNEL_CREATE = 'channel_create',
  CHANNEL_SELECT = 'channel_select',
  CHANNEL_EDIT = 'channel_edit',
  CHANNEL_DELETE = 'channel_delete',
  NOTE_CREATE = 'note_create',
  MESSAGE_EDIT = 'message_edit',
  MESSAGE_DELETE = 'message_delete',
  MESSAGE_REPLY = 'message_reply',
  AI_ASSISTANT_OPEN = 'ai_assistant_open',
  AI_ASSISTANT_CLOSE = 'ai_assistant_close',
  AI_MESSAGE_SEND = 'ai_message_send',
  AI_MESSAGE_RECEIVE = 'ai_message_receive',
  AI_TOOL_USE = 'ai_tool_use',
  THREAD_OPEN = 'thread_open',
  THREAD_CLOSE = 'thread_close',
  THREAD_REPLY = 'thread_reply',
  SEARCH_START = 'search_start',
  SEARCH_RESULT = 'search_result',
  SEARCH_SELECT = 'search_select',
  SIDEBAR_TOGGLE = 'sidebar_toggle',
  INPUT_COLLAPSE = 'input_collapse',
  SCROLL_TO_BOTTOM = 'scroll_to_bottom',
  MESSAGE_EXPAND = 'message_expand',
  SETTINGS_OPEN = 'settings_open',
  THEME_CHANGE = 'theme_change',
  CONTEXT_MODE_CHANGE = 'context_mode_change',
  PAGE_LOAD = 'page_load',
  MESSAGE_LOAD = 'message_load',
  VIRTUALIZATION_PERFORMANCE = 'virtualization_performance',
  ERROR_OCCURRED = 'error_occurred',
  AI_FAILURE = 'ai_failure',
  DAILY_ACTIVE = 'daily_active',
  SESSION_METRICS = 'session_metrics',
  FEATURE_USAGE = 'feature_usage',
  EXPORT = 'export',
  TAG_USE = 'tag_use',
  HOTKEY_USE = 'hotkey_use',
  MOBILE_GESTURE = 'mobile_gesture',
  PWA_INSTALL = 'pwa_install',
  PWA_UPDATE = 'pwa_update',
  BATCH_OPERATION = 'batch_operation',
  FEEDBACK = 'feedback'
}
```

### 2. Platform - 平台类型

```typescript
export enum Platform {
  DESKTOP = 'desktop',
  MOBILE = 'mobile'
}
```

### 3. NoteType - 笔记类型

```typescript
export enum NoteType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file'
}
```

### 4. ChannelEditField - 频道编辑字段

```typescript
export enum ChannelEditField {
  NAME = 'name',
  DESCRIPTION = 'description',
  EMOJI = 'emoji'
}
```

### 5. AITrigger - AI助手触发方式

```typescript
export enum AITrigger {
  BUTTON = 'button',
  HOTKEY = 'hotkey',
  AUTO = 'auto'
}
```

### 6. ContextMode - 上下文模式

```typescript
export enum ContextMode {
  NONE = 'none',
  CHANNEL = 'channel',
  ALL = 'all'
}
```

### 7. SidebarType - 侧边栏类型

```typescript
export enum SidebarType {
  LEFT = 'left',
  RIGHT = 'right'
}
```

### 8. SidebarAction - 侧边栏操作

```typescript
export enum SidebarAction {
  OPEN = 'open',
  CLOSE = 'close'
}
```

### 9. InputAction - 输入框操作

```typescript
export enum InputAction {
  COLLAPSE = 'collapse',
  EXPAND = 'expand'
}
```

### 10. Theme - 主题类型

```typescript
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}
```

### 11. ExportFormat - 导出格式

```typescript
export enum ExportFormat {
  MARKDOWN = 'markdown',
  PDF = 'pdf',
  JSON = 'json'
}
```

### 12. TagAction - 标签操作

```typescript
export enum TagAction {
  CREATE = 'create',
  APPLY = 'apply',
  REMOVE = 'remove'
}
```

### 13. MobileGesture - 移动端手势

```typescript
export enum MobileGesture {
  SWIPE = 'swipe',
  PINCH = 'pinch',
  TAP = 'tap'
}
```

### 14. FeedbackType - 反馈类型

```typescript
export enum FeedbackType {
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement'
}
```

### 15. SearchScope - 搜索范围

```typescript
export enum SearchScope {
  CHANNEL = 'channel',
  GLOBAL = 'global'
}
```

## 使用示例

### 基础导入

```typescript
import { 
  logService, 
  Platform, 
  NoteType, 
  ChannelEditField,
  AITrigger,
  ContextMode,
  SidebarType,
  SidebarAction,
  InputAction,
  Theme,
  ExportFormat,
  TagAction,
  MobileGesture,
  FeedbackType
} from '@/common/services/log.service';
```

### 使用枚举

```typescript
// 应用启动
logService.logAppStart(Platform.DESKTOP, '1.0.0');

// 笔记创建
logService.logNoteCreate(
  'channel_123', 
  NoteType.TEXT, 
  150, 
  true
);

// 频道编辑
logService.logChannelEdit(
  'channel_123', 
  ChannelEditField.NAME
);

// AI助手打开
logService.logAIAssistantOpen(
  'channel_123', 
  AITrigger.BUTTON
);

// 侧边栏切换
logService.logSidebarToggle(
  SidebarType.LEFT, 
  SidebarAction.OPEN
);

// 主题切换
logService.logThemeChange(Theme.DARK);

// 导出功能
logService.logExport(
  ExportFormat.MARKDOWN, 
  'channel_123', 
  50
);

// 标签使用
logService.logTagUse(
  '工作', 
  'channel_123', 
  TagAction.APPLY
);

// 移动端手势
logService.logMobileGesture(
  MobileGesture.SWIPE, 
  'next_channel'
);

// 用户反馈
logService.logFeedback(
  FeedbackType.FEATURE, 
  5, 
  'channel_123'
);
```

## 优势

### 1. 类型安全
- 编译时检查参数类型
- 避免拼写错误
- IDE自动补全支持

### 2. 代码一致性
- 统一的命名规范
- 避免硬编码字符串
- 便于重构和维护

### 3. 可维护性
- 集中管理所有常量
- 易于添加新的事件类型
- 便于批量修改

### 4. 可读性
- 语义化的枚举名称
- 清晰的代码意图
- 减少注释需求

## 最佳实践

### 1. 导入策略
```typescript
// 推荐：按需导入
import { logService, Platform, NoteType } from '@/common/services/log.service';

// 避免：全量导入
import * as LogService from '@/common/services/log.service';
```

### 2. 枚举使用
```typescript
// 推荐：使用枚举
logService.logAppStart(Platform.DESKTOP, '1.0.0');

// 避免：硬编码字符串
logService.logAppStart('desktop', '1.0.0');
```

### 3. 类型检查
```typescript
// 推荐：使用枚举类型
const handleThemeChange = (theme: Theme) => {
  logService.logThemeChange(theme);
};

// 避免：使用字符串联合类型
const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
  logService.logThemeChange(theme);
};
```

### 4. 错误处理
```typescript
// 推荐：枚举值验证
const isValidPlatform = (value: string): value is Platform => {
  return Object.values(Platform).includes(value as Platform);
};

// 使用
if (isValidPlatform(platform)) {
  logService.logAppStart(platform, version);
}
```

## 注意事项

1. **枚举值不可变**: 枚举值在运行时是常量，不能修改
2. **字符串枚举**: 所有枚举都是字符串枚举，便于调试和日志记录
3. **类型兼容性**: 枚举值与字符串类型兼容，但建议使用枚举类型
4. **性能影响**: 枚举使用对性能影响极小，可以放心使用
5. **向后兼容**: 添加新的枚举值不会破坏现有代码

## 扩展指南

### 添加新的事件类型
1. 在 `AnalyticsEvent` 枚举中添加新的事件名称
2. 在 `LogService` 类中添加对应的埋点方法
3. 更新相关文档和示例

### 添加新的参数枚举
1. 定义新的枚举类型
2. 在相关埋点方法中使用新枚举
3. 更新类型定义和文档

### 修改现有枚举
1. 确保向后兼容性
2. 更新所有使用该枚举的代码
3. 更新相关文档和测试
