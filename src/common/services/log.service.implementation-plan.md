# LogService 埋点实施计划

## 实施优先级

### 第一阶段：核心功能埋点（高优先级）

#### 1. 应用生命周期
- [ ] 应用启动埋点 (`logAppStart`)
- [ ] 应用关闭埋点 (`logAppClose`)
- [ ] 页面加载性能埋点 (`logPageLoad`)

#### 2. 频道管理
- [ ] 频道创建埋点 (`logChannelCreate`)
- [ ] 频道选择埋点 (`logChannelSelect`)
- [ ] 频道编辑埋点 (`logChannelEdit`)
- [ ] 频道删除埋点 (`logChannelDelete`)

#### 3. 消息操作
- [x] 笔记创建埋点 (`logNoteCreate`)
- [ ] 消息编辑埋点 (`logMessageEdit`)
- [ ] 消息删除埋点 (`logMessageDelete`)
- [ ] 消息回复埋点 (`logMessageReply`)

#### 4. AI助手交互
- [ ] AI助手打开埋点 (`logAIAssistantOpen`)
- [ ] AI助手关闭埋点 (`logAIAssistantClose`)
- [ ] AI消息发送埋点 (`logAIMessageSend`)
- [ ] AI消息接收埋点 (`logAIMessageReceive`)

### 第二阶段：用户体验埋点（中优先级）

#### 5. 界面交互
- [ ] 侧边栏切换埋点 (`logSidebarToggle`)
- [ ] 输入框折叠埋点 (`logInputCollapse`)
- [ ] 滚动到底部埋点 (`logScrollToBottom`)
- [ ] 消息展开埋点 (`logMessageExpand`)

#### 6. 搜索功能
- [ ] 搜索开始埋点 (`logSearchStart`)
- [ ] 搜索结果埋点 (`logSearchResult`)
- [ ] 搜索选择埋点 (`logSearchSelect`)

#### 7. 线程管理
- [ ] 线程打开埋点 (`logThreadOpen`)
- [ ] 线程关闭埋点 (`logThreadClose`)
- [ ] 线程回复埋点 (`logThreadReply`)

### 第三阶段：高级功能埋点（低优先级）

#### 8. 性能监控
- [ ] 消息加载性能埋点 (`logMessageLoad`)
- [ ] 虚拟化性能埋点 (`logVirtualizationPerformance`)

#### 9. 错误监控
- [ ] 通用错误埋点 (`logError`)
- [ ] AI失败埋点 (`logAIFailure`)

#### 10. 用户参与度
- [ ] 每日活跃埋点 (`logDailyActive`)
- [ ] 会话指标埋点 (`logSessionMetrics`)

### 第四阶段：扩展功能埋点（可选）

#### 11. 功能使用统计
- [ ] 功能使用埋点 (`logFeatureUsage`)
- [ ] 导出功能埋点 (`logExport`)
- [ ] 标签使用埋点 (`logTagUse`)
- [ ] 快捷键使用埋点 (`logHotkeyUse`)

#### 12. 移动端特定
- [ ] 移动端手势埋点 (`logMobileGesture`)

#### 13. PWA相关
- [ ] PWA安装埋点 (`logPWAInstall`)
- [ ] PWA更新埋点 (`logPWAUpdate`)

#### 14. 其他功能
- [ ] 批量操作埋点 (`logBatchOperation`)
- [ ] 用户反馈埋点 (`logFeedback`)

## 实施步骤

### 步骤1：基础设置
1. 确保 Firebase Analytics 配置正确
2. 在主要组件中导入 LogService
3. 设置基础的应用生命周期埋点

### 步骤2：核心功能埋点
1. 在频道管理组件中添加埋点
2. 在消息操作组件中添加埋点
3. 在AI助手组件中添加埋点

### 步骤3：用户体验埋点
1. 在界面交互组件中添加埋点
2. 在搜索功能中添加埋点
3. 在线程管理中添加埋点

### 步骤4：性能监控埋点
1. 在性能关键路径中添加埋点
2. 设置错误监控埋点
3. 添加用户参与度埋点

### 步骤5：测试和优化
1. 测试所有埋点功能
2. 优化埋点性能
3. 验证数据准确性

## 具体实施位置

### 频道管理埋点
- `src/desktop/features/notes/features/channel-management/components/channel-list.tsx`
- `src/desktop/features/notes/features/channel-management/components/channel-item.tsx`
- `src/desktop/features/notes/features/channel-management/components/channel-more-actions-menu.tsx`

### 消息操作埋点
- `src/common/features/notes/components/message-timeline/message-timeline.tsx`
- `src/common/features/notes/components/message-timeline/virtualized-message-timeline.tsx`
- `src/desktop/features/notes/features/message-timeline/components/thought-record/components/action-buttons.tsx`

### AI助手埋点
- `src/common/features/ai-assistant/components/ai-assistant-core/ai-assistant-core.tsx`
- `src/common/features/ai-assistant/components/ai-conversation-chat.tsx`
- `src/desktop/features/notes/features/ai-assistant/hooks/use-ai-assistant.ts`

### 搜索功能埋点
- `src/common/features/note-search/` (需要确认具体文件)

### 线程管理埋点
- `src/desktop/features/notes/features/thread-management/hooks/use-thread-sidebar.ts`

### 界面交互埋点
- `src/desktop/features/notes/features/message-timeline/components/channel-cover-header.tsx`
- `src/desktop/features/notes/features/message-timeline/hooks/use-input-collapse.ts`

## 数据验证

### 埋点数据验证清单
- [ ] 所有埋点事件都有正确的参数
- [ ] 参数类型与定义一致
- [ ] 敏感信息未被记录
- [ ] 埋点性能影响最小
- [ ] 错误处理完善

### 测试用例
1. 测试每个埋点方法的基本功能
2. 测试参数传递的正确性
3. 测试错误处理机制
4. 测试性能影响
5. 测试数据隐私保护

## 监控和优化

### 监控指标
- 埋点发送成功率
- 埋点数据准确性
- 性能影响评估
- 用户隐私合规性

### 优化策略
- 批量发送埋点数据
- 异步处理埋点操作
- 缓存常用参数
- 定期清理无用埋点

## 注意事项

1. **隐私保护**: 确保不记录用户敏感信息
2. **性能影响**: 埋点操作应该是轻量级的
3. **数据准确性**: 确保埋点数据准确反映用户行为
4. **可维护性**: 保持埋点代码的清晰和可维护
5. **合规性**: 遵循相关数据保护法规

## 成功标准

- [ ] 所有核心功能都有相应的埋点
- [ ] 埋点数据准确反映用户行为
- [ ] 性能影响在可接受范围内
- [ ] 隐私保护措施完善
- [ ] 代码质量符合项目标准
