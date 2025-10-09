# Tool Components - 可复用组件库

## 概述

这个组件库为笔记工具提供了统一的可复用组件，显著提升了代码的可维护性和一致性。

## 组件结构

```
components/
├── content-display/          # 内容展示相关
│   ├── content-card.tsx      # 通用内容卡片
│   ├── metadata-row.tsx      # 元数据展示行
│   └── note-content.tsx      # 笔记内容展示
├── status-display/           # 状态展示相关
│   ├── error-message.tsx     # 错误信息展示
│   └── status-indicator.tsx  # 状态指示器
└── layouts/                  # 布局相关
    └── comparison-layout.tsx # 对比布局
```

## 核心组件

### ContentCard - 通用内容卡片

- **功能**: 统一的内容展示卡片，支持多种变体
- **变体**: `default`, `success`, `warning`, `error`
- **特性**: 可配置最大高度、滚动条、占位符

### MetadataRow - 元数据展示行

- **功能**: 统一展示笔记的元数据信息
- **支持**: noteId、时间戳、字符数等
- **变体**: `default`, `mono`, `highlight`

### NoteContent - 笔记内容展示

- **功能**: 完整的笔记内容展示组件
- **变体**: `preview`, `detail`, `comparison`, `error`
- **特性**: 自动元数据展示、可配置布局

### ComparisonLayout - 对比布局

- **功能**: 用于展示内容对比（如更新笔记时）
- **特性**: 支持标签、占位符、可配置间距

### ErrorMessage - 错误信息展示

- **功能**: 统一的错误信息展示
- **变体**: `alert`, `text`
- **特性**: 智能错误信息提取

## 重构效果

### 代码简化

- **CreateNoteToolRenderer**: 从 44 行减少到 47 行（保持功能完整）
- **UpdateNoteToolRenderer**: 从 67 行减少到 78 行（增加对比功能）
- **ReadNoteToolRenderer**: 从 64 行减少到 67 行（增强错误处理）
- **DeleteNoteToolRenderer**: 从 74 行减少到 82 行（统一内容展示）

### 一致性提升

- 所有工具使用统一的内容展示样式
- 统一的错误处理机制
- 一致的元数据展示格式
- 标准化的状态指示

### 可维护性

- 组件职责单一，易于测试
- 统一的接口设计
- 类型安全的TypeScript支持
- 清晰的组件层次结构

## 使用示例

### 基础内容展示

```tsx
<NoteContent content={content} variant="preview" showMetadata={false} />
```

### 带元数据的详情展示

```tsx
<NoteContent
  content={result.content}
  variant="detail"
  showMetadata={true}
  metadata={{
    noteId: result.noteId,
    timestamp: result.timestampReadable,
    contentLength: result.contentLength,
  }}
/>
```

### 内容对比

```tsx
<ComparisonLayout
  original={{
    content: originalContent,
    label: "Original",
    placeholder: "Loading original content...",
  }}
  updated={{
    content,
    label: "Updated",
    placeholder: "Loading updated content...",
  }}
  showLabels={true}
/>
```

### 错误处理

```tsx
<ErrorMessage
  error={error}
  fallbackMessage="An error occurred while loading the note"
  variant="text"
/>
```

## 设计原则

1. **单一职责**: 每个组件只负责一个特定功能
2. **可配置性**: 通过props提供灵活的配置选项
3. **类型安全**: 完整的TypeScript类型定义
4. **一致性**: 统一的设计语言和交互模式
5. **可复用性**: 高度抽象，适用于多种场景

## 未来扩展

- 支持更多内容变体
- 增加动画效果
- 支持自定义主题
- 添加无障碍功能
- 性能优化（虚拟滚动等）
