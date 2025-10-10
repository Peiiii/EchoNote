# LogService 埋点系统

## 概述

LogService 是 StillRoot 应用的用户行为分析和性能监控系统，基于 Firebase Analytics 构建，提供全面的数据收集和分析能力。

## 文件结构

```
src/common/services/
├── log.service.ts                    # 核心埋点服务
├── log.service.examples.md          # 使用示例
├── log.service.implementation-plan.md # 实施计划
├── log.service.data-dictionary.md   # 数据字典
└── README.md                        # 本文档
```

## 核心功能

### 1. 用户行为分析
- 应用生命周期跟踪
- 频道管理行为
- 消息操作记录
- AI助手交互分析
- 搜索功能使用统计

### 2. 性能监控
- 页面加载性能
- 消息加载性能
- 虚拟化性能监控
- 错误监控和报告

### 3. 用户体验分析
- 界面交互统计
- 功能使用频率
- 用户参与度指标
- 移动端手势分析

## 快速开始

### 基础使用

```typescript
import { logService } from '@/common/services/log.service';

// 记录应用启动
logService.logAppStart('desktop', '1.0.0');

// 记录频道创建
logService.logChannelCreate('channel_123', '工作日志', true);

// 记录消息发送
logService.logMessageSend('channel_123', 'text', 150, true);
```

### 高级使用

```typescript
// 记录AI助手交互
logService.logAIAssistantOpen('channel_123', 'button');
logService.logAIMessageSend('channel_123', 200, 'channel');
logService.logAIMessageReceive('channel_123', 500, 2000, true);

// 记录性能指标
logService.logPageLoad('notes', 1200, 'desktop');
logService.logVirtualizationPerformance('channel_123', 20, 100, 50);
```

## 埋点分类

### 核心功能埋点
- 应用生命周期
- 频道管理
- 消息操作
- AI助手交互

### 用户体验埋点
- 界面交互
- 搜索功能
- 线程管理
- 设置和偏好

### 性能监控埋点
- 页面加载
- 消息加载
- 虚拟化性能
- 错误监控

### 扩展功能埋点
- 功能使用统计
- 移动端特定
- PWA相关
- 用户反馈

## 实施指南

### 第一阶段：核心功能
1. 应用生命周期埋点
2. 频道管理埋点
3. 消息操作埋点
4. AI助手交互埋点

### 第二阶段：用户体验
1. 界面交互埋点
2. 搜索功能埋点
3. 线程管理埋点

### 第三阶段：性能监控
1. 性能监控埋点
2. 错误监控埋点
3. 用户参与度埋点

### 第四阶段：扩展功能
1. 功能使用统计埋点
2. 移动端特定埋点
3. PWA相关埋点

## 最佳实践

### 1. 埋点时机
- 在用户操作完成后立即记录
- 避免在异步操作开始前记录
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

## 数据字典

详细的参数定义和示例请参考 [数据字典文档](./log.service.data-dictionary.md)。

## 使用示例

完整的使用示例请参考 [使用示例文档](./log.service.examples.md)。

## 实施计划

详细的实施步骤请参考 [实施计划文档](./log.service.implementation-plan.md)。

## 注意事项

1. **类型安全**: 所有埋点参数都应该有明确的类型定义
2. **性能影响**: 埋点操作应该尽可能轻量
3. **数据准确性**: 确保埋点数据准确反映用户行为
4. **隐私合规**: 遵循相关隐私保护法规
5. **可维护性**: 保持埋点代码的可读性和可维护性

## 监控和优化

### 关键指标
- 埋点发送成功率
- 埋点数据准确性
- 性能影响评估
- 用户隐私合规性

### 优化策略
- 批量发送埋点数据
- 异步处理埋点操作
- 缓存常用参数
- 定期清理无用埋点

## 支持

如有问题或建议，请参考相关文档或联系开发团队。
