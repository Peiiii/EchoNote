# Agent Tools UI - 通用组件库

## 概述

这是一个专门为 Agent 工具展示设计的通用 UI 组件库，可以在任何基于 `@agent-labs/agent-chat` 框架的项目中复用。

## 目录结构

```
src/common/lib/agent-tools-ui/
├── display/                   # 展示组件
│   ├── content-card.tsx      # 内容卡片
│   ├── error-message.tsx     # 错误信息
│   ├── empty-state.tsx       # 空状态
│   ├── status-indicator.tsx  # 状态指示器
│   └── metadata-row.tsx      # 元数据行
├── layout/                   # 布局组件
│   └── comparison-layout.tsx # 对比布局
├── panels/                   # 工具面板
│   ├── display-tool-panel.tsx      # 展示类工具面板
│   ├── interactive-tool-panel.tsx  # 交互类工具面板
│   ├── tool-panel.tsx              # 基础工具面板
│   ├── tool-container.tsx          # 工具容器
│   ├── tool-display-header.tsx     # 工具显示头部
│   ├── tool-display-content.tsx    # 工具显示内容
│   └── confirm-footer.tsx          # 确认操作底部
├── utils/                    # 工具函数
│   ├── invocation-utils.ts   # 工具调用工具函数
│   └── use-confirm-action.ts # 确认操作 Hook
└── index.ts                  # 统一导出
```

## 组件分类

### 纯UI组件 (display/)
- **ContentCard**: 通用内容卡片，支持多种变体
- **ErrorMessage**: 智能错误信息展示
- **EmptyState**: 空状态展示
- **StatusIndicator**: 状态指示器
- **MetadataRow**: 元数据展示行

### 布局组件 (layout/)
- **ComparisonLayout**: 内容对比布局

### Agent工具面板 (panels/)
- **DisplayToolPanel**: 展示类工具面板
- **InteractiveToolPanel**: 交互类工具面板
- **ToolPanel**: 基础工具面板
- **ToolContainer**: 工具容器
- **ConfirmFooter**: 确认操作底部

## 使用示例

### 基础展示组件
```tsx
import { ContentCard, ErrorMessage, EmptyState } from '@/common/lib/agent-tools-ui';

// 内容卡片
<ContentCard 
  content="Hello World" 
  variant="success" 
  maxHeight="200px" 
/>

// 错误信息
<ErrorMessage 
  error={error} 
  variant="alert" 
/>

// 空状态
<EmptyState 
  icon={FileText} 
  message="No data found" 
/>
```

### Agent工具面板
```tsx
import { DisplayToolPanel, InteractiveToolPanel } from '@/common/lib/agent-tools-ui';

// 展示类工具
<DisplayToolPanel
  invocation={invocation}
  icon={<FileText />}
  title="Read Note"
  loadingText="Loading..."
  successStatusText={(result) => `Found ${result.notes.length} notes`}
>
  {(args, result, error) => (
    // 内容渲染逻辑
  )}
</DisplayToolPanel>

// 交互类工具
<InteractiveToolPanel
  invocation={invocation}
  onResult={onResult}
  icon={<Edit />}
  title="Update Note"
  confirm={async () => {
    // 确认操作逻辑
  }}
>
  {(args, result, error) => (
    // 内容渲染逻辑
  )}
</InteractiveToolPanel>
```

## 设计原则

1. **通用性**: 所有组件都设计为通用，不依赖特定业务逻辑
2. **类型安全**: 完整的 TypeScript 类型定义
3. **可配置**: 通过 props 提供灵活的配置选项
4. **一致性**: 统一的设计语言和交互模式
5. **可复用**: 高度抽象，适用于多种场景

## 未来扩展

- 支持更多展示变体
- 增加动画效果
- 支持自定义主题
- 添加无障碍功能
- 性能优化

## 拆分为独立库

这个组件库设计为可以轻松拆分为独立的 npm 包：

1. **独立依赖**: 只依赖 `@agent-labs/agent-chat` 和基础 UI 组件
2. **统一导出**: 通过 `index.ts` 提供清晰的 API
3. **类型安全**: 完整的 TypeScript 类型定义
4. **文档完善**: 清晰的使用文档和示例

拆分为独立库时，只需要：
1. 创建独立的 `package.json`
2. 配置构建工具
3. 发布到 npm
4. 更新导入路径
