# LogService 埋点数据字典

## 概述

本文档详细描述了 StillRoot 应用中所有埋点事件的参数定义、用途和示例数据。

## 埋点事件分类

### 1. 应用生命周期事件

#### app_start
**用途**: 记录应用启动事件
**参数**:
- `platform`: string - 平台类型 ('desktop' | 'mobile')
- `version`: string - 应用版本号

**示例**:
```json
{
  "event_name": "app_start",
  "platform": "desktop",
  "version": "1.0.0"
}
```

#### app_close
**用途**: 记录应用关闭事件
**参数**:
- `session_duration`: number - 会话持续时间（毫秒）

**示例**:
```json
{
  "event_name": "app_close",
  "session_duration": 1800000
}
```

### 2. 频道管理事件

#### channel_create
**用途**: 记录频道创建事件
**参数**:
- `channel_id`: string - 频道ID
- `channel_name`: string - 频道名称
- `has_description`: boolean - 是否有描述

**示例**:
```json
{
  "event_name": "channel_create",
  "channel_id": "channel_123",
  "channel_name": "工作日志",
  "has_description": true
}
```

#### channel_select
**用途**: 记录频道选择事件
**参数**:
- `channel_id`: string - 频道ID
- `channel_name`: string - 频道名称
- `message_count`: number - 频道消息数量

**示例**:
```json
{
  "event_name": "channel_select",
  "channel_id": "channel_123",
  "channel_name": "工作日志",
  "message_count": 45
}
```

#### channel_edit
**用途**: 记录频道编辑事件
**参数**:
- `channel_id`: string - 频道ID
- `field`: string - 编辑的字段 ('name' | 'description' | 'emoji')

**示例**:
```json
{
  "event_name": "channel_edit",
  "channel_id": "channel_123",
  "field": "name"
}
```

#### channel_delete
**用途**: 记录频道删除事件
**参数**:
- `channel_id`: string - 频道ID
- `channel_name`: string - 频道名称
- `message_count`: number - 频道消息数量

**示例**:
```json
{
  "event_name": "channel_delete",
  "channel_id": "channel_123",
  "channel_name": "工作日志",
  "message_count": 45
}
```

### 3. 消息操作事件

#### message_send
**用途**: 记录消息发送事件
**参数**:
- `channel_id`: string - 频道ID
- `message_type`: string - 消息类型 ('text' | 'image' | 'file')
- `content_length`: number - 内容长度
- `has_tags`: boolean - 是否包含标签

**示例**:
```json
{
  "event_name": "message_send",
  "channel_id": "channel_123",
  "message_type": "text",
  "content_length": 150,
  "has_tags": true
}
```

#### message_edit
**用途**: 记录消息编辑事件
**参数**:
- `message_id`: string - 消息ID
- `channel_id`: string - 频道ID
- `edit_count`: number - 编辑次数

**示例**:
```json
{
  "event_name": "message_edit",
  "message_id": "msg_456",
  "channel_id": "channel_123",
  "edit_count": 2
}
```

#### message_delete
**用途**: 记录消息删除事件
**参数**:
- `message_id`: string - 消息ID
- `channel_id`: string - 频道ID
- `message_age`: number - 消息年龄（毫秒）

**示例**:
```json
{
  "event_name": "message_delete",
  "message_id": "msg_456",
  "channel_id": "channel_123",
  "message_age": 3600000
}
```

#### message_reply
**用途**: 记录消息回复事件
**参数**:
- `message_id`: string - 消息ID
- `channel_id`: string - 频道ID
- `thread_id`: string - 线程ID

**示例**:
```json
{
  "event_name": "message_reply",
  "message_id": "msg_456",
  "channel_id": "channel_123",
  "thread_id": "thread_789"
}
```

### 4. AI助手交互事件

#### ai_assistant_open
**用途**: 记录AI助手打开事件
**参数**:
- `channel_id`: string - 频道ID
- `trigger`: string - 触发方式 ('button' | 'hotkey' | 'auto')

**示例**:
```json
{
  "event_name": "ai_assistant_open",
  "channel_id": "channel_123",
  "trigger": "button"
}
```

#### ai_assistant_close
**用途**: 记录AI助手关闭事件
**参数**:
- `channel_id`: string - 频道ID
- `session_duration`: number - 会话持续时间（毫秒）
- `message_count`: number - 消息数量

**示例**:
```json
{
  "event_name": "ai_assistant_close",
  "channel_id": "channel_123",
  "session_duration": 300000,
  "message_count": 5
}
```

#### ai_message_send
**用途**: 记录AI消息发送事件
**参数**:
- `channel_id`: string - 频道ID
- `message_length`: number - 消息长度
- `context_mode`: string - 上下文模式 ('none' | 'channel' | 'all')

**示例**:
```json
{
  "event_name": "ai_message_send",
  "channel_id": "channel_123",
  "message_length": 200,
  "context_mode": "channel"
}
```

#### ai_message_receive
**用途**: 记录AI消息接收事件
**参数**:
- `channel_id`: string - 频道ID
- `response_length`: number - 响应长度
- `response_time`: number - 响应时间（毫秒）
- `tool_used`: boolean - 是否使用了工具

**示例**:
```json
{
  "event_name": "ai_message_receive",
  "channel_id": "channel_123",
  "response_length": 500,
  "response_time": 2000,
  "tool_used": true
}
```

#### ai_tool_use
**用途**: 记录AI工具使用事件
**参数**:
- `tool_name`: string - 工具名称
- `channel_id`: string - 频道ID
- `success`: boolean - 是否成功

**示例**:
```json
{
  "event_name": "ai_tool_use",
  "tool_name": "createNote",
  "channel_id": "channel_123",
  "success": true
}
```

### 5. 线程管理事件

#### thread_open
**用途**: 记录线程打开事件
**参数**:
- `message_id`: string - 消息ID
- `channel_id`: string - 频道ID
- `thread_count`: number - 线程数量

**示例**:
```json
{
  "event_name": "thread_open",
  "message_id": "msg_456",
  "channel_id": "channel_123",
  "thread_count": 3
}
```

#### thread_close
**用途**: 记录线程关闭事件
**参数**:
- `message_id`: string - 消息ID
- `channel_id`: string - 频道ID
- `session_duration`: number - 会话持续时间（毫秒）

**示例**:
```json
{
  "event_name": "thread_close",
  "message_id": "msg_456",
  "channel_id": "channel_123",
  "session_duration": 180000
}
```

#### thread_reply
**用途**: 记录线程回复事件
**参数**:
- `message_id`: string - 消息ID
- `channel_id`: string - 频道ID
- `thread_id`: string - 线程ID

**示例**:
```json
{
  "event_name": "thread_reply",
  "message_id": "msg_456",
  "channel_id": "channel_123",
  "thread_id": "thread_789"
}
```

### 6. 搜索功能事件

#### search_start
**用途**: 记录搜索开始事件
**参数**:
- `query`: string - 搜索查询
- `channel_id`: string - 频道ID（可选）
- `search_scope`: string - 搜索范围 ('channel' | 'global')

**示例**:
```json
{
  "event_name": "search_start",
  "query": "工作日志",
  "channel_id": "channel_123",
  "search_scope": "channel"
}
```

#### search_result
**用途**: 记录搜索结果事件
**参数**:
- `query`: string - 搜索查询
- `result_count`: number - 结果数量
- `channel_id`: string - 频道ID（可选）
- `search_scope`: string - 搜索范围 ('channel' | 'global')

**示例**:
```json
{
  "event_name": "search_result",
  "query": "工作日志",
  "result_count": 5,
  "channel_id": "channel_123",
  "search_scope": "channel"
}
```

#### search_select
**用途**: 记录搜索选择事件
**参数**:
- `query`: string - 搜索查询
- `result_index`: number - 结果索引
- `channel_id`: string - 频道ID（可选）
- `search_scope`: string - 搜索范围 ('channel' | 'global')

**示例**:
```json
{
  "event_name": "search_select",
  "query": "工作日志",
  "result_index": 2,
  "channel_id": "channel_123",
  "search_scope": "channel"
}
```

### 7. 界面交互事件

#### sidebar_toggle
**用途**: 记录侧边栏切换事件
**参数**:
- `sidebar`: string - 侧边栏类型 ('left' | 'right')
- `action`: string - 操作类型 ('open' | 'close')

**示例**:
```json
{
  "event_name": "sidebar_toggle",
  "sidebar": "left",
  "action": "open"
}
```

#### input_collapse
**用途**: 记录输入框折叠事件
**参数**:
- `action`: string - 操作类型 ('collapse' | 'expand')

**示例**:
```json
{
  "event_name": "input_collapse",
  "action": "collapse"
}
```

#### scroll_to_bottom
**用途**: 记录滚动到底部事件
**参数**:
- `channel_id`: string - 频道ID
- `message_count`: number - 消息数量

**示例**:
```json
{
  "event_name": "scroll_to_bottom",
  "channel_id": "channel_123",
  "message_count": 45
}
```

#### message_expand
**用途**: 记录消息展开事件
**参数**:
- `message_id`: string - 消息ID
- `channel_id`: string - 频道ID
- `content_length`: number - 内容长度

**示例**:
```json
{
  "event_name": "message_expand",
  "message_id": "msg_456",
  "channel_id": "channel_123",
  "content_length": 500
}
```

### 8. 设置和偏好事件

#### settings_open
**用途**: 记录设置打开事件
**参数**:
- `channel_id`: string - 频道ID（可选）

**示例**:
```json
{
  "event_name": "settings_open",
  "channel_id": "channel_123"
}
```

#### theme_change
**用途**: 记录主题切换事件
**参数**:
- `theme`: string - 主题类型 ('light' | 'dark' | 'system')

**示例**:
```json
{
  "event_name": "theme_change",
  "theme": "dark"
}
```

#### context_mode_change
**用途**: 记录上下文模式切换事件
**参数**:
- `mode`: string - 模式类型 ('none' | 'channel' | 'all')
- `channel_id`: string - 频道ID（可选）

**示例**:
```json
{
  "event_name": "context_mode_change",
  "mode": "channel",
  "channel_id": "channel_123"
}
```

### 9. 性能监控事件

#### page_load
**用途**: 记录页面加载事件
**参数**:
- `page`: string - 页面名称
- `load_time`: number - 加载时间（毫秒）
- `platform`: string - 平台类型 ('desktop' | 'mobile')

**示例**:
```json
{
  "event_name": "page_load",
  "page": "notes",
  "load_time": 1200,
  "platform": "desktop"
}
```

#### message_load
**用途**: 记录消息加载事件
**参数**:
- `channel_id`: string - 频道ID
- `message_count`: number - 消息数量
- `load_time`: number - 加载时间（毫秒）

**示例**:
```json
{
  "event_name": "message_load",
  "channel_id": "channel_123",
  "message_count": 50,
  "load_time": 800
}
```

#### virtualization_performance
**用途**: 记录虚拟化性能事件
**参数**:
- `channel_id`: string - 频道ID
- `visible_count`: number - 可见消息数量
- `total_count`: number - 总消息数量
- `render_time`: number - 渲染时间（毫秒）

**示例**:
```json
{
  "event_name": "virtualization_performance",
  "channel_id": "channel_123",
  "visible_count": 20,
  "total_count": 100,
  "render_time": 50
}
```

### 10. 错误监控事件

#### error_occurred
**用途**: 记录错误发生事件
**参数**:
- `error_type`: string - 错误类型
- `error_message`: string - 错误消息
- `component`: string - 组件名称
- `channel_id`: string - 频道ID（可选）

**示例**:
```json
{
  "event_name": "error_occurred",
  "error_type": "NetworkError",
  "error_message": "Failed to load messages",
  "component": "MessageTimeline",
  "channel_id": "channel_123"
}
```

#### ai_failure
**用途**: 记录AI失败事件
**参数**:
- `channel_id`: string - 频道ID
- `error_type`: string - 错误类型
- `retry_count`: number - 重试次数

**示例**:
```json
{
  "event_name": "ai_failure",
  "channel_id": "channel_123",
  "error_type": "TimeoutError",
  "retry_count": 3
}
```

### 11. 用户参与度事件

#### daily_active
**用途**: 记录每日活跃事件
**参数**:
- `message_count`: number - 消息数量
- `channel_count`: number - 频道数量
- `ai_usage_count`: number - AI使用次数

**示例**:
```json
{
  "event_name": "daily_active",
  "message_count": 25,
  "channel_count": 3,
  "ai_usage_count": 8
}
```

#### session_metrics
**用途**: 记录会话指标事件
**参数**:
- `session_duration`: number - 会话持续时间（毫秒）
- `message_count`: number - 消息数量
- `ai_interaction_count`: number - AI交互次数
- `channel_count`: number - 频道数量

**示例**:
```json
{
  "event_name": "session_metrics",
  "session_duration": 1800000,
  "message_count": 15,
  "ai_interaction_count": 5,
  "channel_count": 2
}
```

### 12. 功能使用统计事件

#### feature_usage
**用途**: 记录功能使用事件
**参数**:
- `feature`: string - 功能名称
- `action`: string - 操作类型
- `channel_id`: string - 频道ID（可选）

**示例**:
```json
{
  "event_name": "feature_usage",
  "feature": "quick_search",
  "action": "open",
  "channel_id": "channel_123"
}
```

#### export
**用途**: 记录导出事件
**参数**:
- `format`: string - 导出格式 ('markdown' | 'pdf' | 'json')
- `channel_id`: string - 频道ID
- `message_count`: number - 消息数量

**示例**:
```json
{
  "event_name": "export",
  "format": "markdown",
  "channel_id": "channel_123",
  "message_count": 50
}
```

#### tag_use
**用途**: 记录标签使用事件
**参数**:
- `tag`: string - 标签名称
- `channel_id`: string - 频道ID
- `action`: string - 操作类型 ('create' | 'apply' | 'remove')

**示例**:
```json
{
  "event_name": "tag_use",
  "tag": "工作",
  "channel_id": "channel_123",
  "action": "apply"
}
```

#### hotkey_use
**用途**: 记录快捷键使用事件
**参数**:
- `hotkey`: string - 快捷键
- `context`: string - 上下文

**示例**:
```json
{
  "event_name": "hotkey_use",
  "hotkey": "Ctrl+K",
  "context": "search"
}
```

### 13. 移动端特定事件

#### mobile_gesture
**用途**: 记录移动端手势事件
**参数**:
- `gesture`: string - 手势类型 ('swipe' | 'pinch' | 'tap')
- `action`: string - 操作类型

**示例**:
```json
{
  "event_name": "mobile_gesture",
  "gesture": "swipe",
  "action": "next_channel"
}
```

### 14. PWA相关事件

#### pwa_install
**用途**: 记录PWA安装事件
**参数**:
- `platform`: string - 平台类型

**示例**:
```json
{
  "event_name": "pwa_install",
  "platform": "chrome"
}
```

#### pwa_update
**用途**: 记录PWA更新事件
**参数**:
- `version`: string - 版本号

**示例**:
```json
{
  "event_name": "pwa_update",
  "version": "1.1.0"
}
```

### 15. 批量操作事件

#### batch_operation
**用途**: 记录批量操作事件
**参数**:
- `operation`: string - 操作类型
- `item_count`: number - 项目数量
- `channel_id`: string - 频道ID

**示例**:
```json
{
  "event_name": "batch_operation",
  "operation": "delete_messages",
  "item_count": 10,
  "channel_id": "channel_123"
}
```

### 16. 用户反馈事件

#### feedback
**用途**: 记录用户反馈事件
**参数**:
- `type`: string - 反馈类型 ('bug' | 'feature' | 'improvement')
- `rating`: number - 评分
- `channel_id`: string - 频道ID（可选）

**示例**:
```json
{
  "event_name": "feedback",
  "type": "feature",
  "rating": 5,
  "channel_id": "channel_123"
}
```

## 数据质量要求

### 参数验证
- 所有字符串参数不能为空
- 数值参数必须在合理范围内
- 布尔参数必须为 true 或 false
- 枚举参数必须符合预定义值

### 数据完整性
- 必需参数不能缺失
- 可选参数应该有默认值
- 参数类型必须正确

### 隐私保护
- 不记录用户敏感信息
- 不记录个人身份信息
- 遵循数据保护法规

## 监控和告警

### 关键指标
- 埋点发送成功率
- 埋点数据准确性
- 性能影响评估
- 错误率监控

### 告警规则
- 埋点发送失败率 > 5%
- 关键埋点缺失
- 性能影响过大
- 数据异常波动
