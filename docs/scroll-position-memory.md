# 滚动位置记忆功能

## 概述

在聊天应用中，当用户向上滚动查看历史消息时，新加载的消息不应该打断用户的阅读位置。这个功能实现了滚动位置的智能记忆和恢复，确保用户体验的连续性。

## 工作原理

### 1. 滚动位置记录

在触发`loadMoreHistory`之前，系统会记录当前的滚动状态：

```typescript
const scrollPositionRef = useRef<{
    scrollTop: number;      // 当前滚动位置
    scrollHeight: number;   // 内容总高度
    clientHeight: number;   // 可视区域高度
} | null>(null);
```

### 2. 触发时机

滚动位置记录在以下时机触发：
- 用户滚动到顶部附近（触发懒加载）
- 调用`loadMoreHistory`函数前

### 3. 位置恢复

在历史消息加载完成并渲染到DOM后，系统会：
1. 计算新增内容的高度
2. 调整滚动位置，保持用户关注的相对位置
3. 使用`requestAnimationFrame`确保DOM更新完成

## 实现细节

### 核心Hook: `useChannelMessages`

```typescript
// 记录当前滚动位置
const recordScrollPosition = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    scrollPositionRef.current = {
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight
    };
}, []);

// 恢复滚动位置
const restoreScrollPosition = useCallback(() => {
    if (!scrollPositionRef.current || !containerRef.current) return;

    const { scrollTop, scrollHeight } = scrollPositionRef.current;
    const container = containerRef.current;
    
    requestAnimationFrame(() => {
        if (!container) return;
        
        const newScrollHeight = container.scrollHeight;
        const oldScrollHeight = scrollHeight;
        const addedHeight = newScrollHeight - oldScrollHeight;
        
        if (addedHeight > 0) {
            container.scrollTop = scrollTop + addedHeight;
        }
        
        scrollPositionRef.current = null;
    });
}, []);
```

### 集成流程

1. **TimelineContent** 使用 `useChannelMessages` 获取 `containerRef`
2. **MessageTimeline** 接收 `containerRef` 并应用到滚动容器
3. 滚动事件触发懒加载，记录当前位置
4. 消息加载完成后自动恢复滚动位置

## 用户体验

### 加载前
- 用户正在查看某条历史消息
- 滚动位置在页面中间或顶部附近

### 加载中
- 显示加载状态
- 滚动位置保持不变

### 加载后
- 新消息出现在顶部
- 滚动位置自动调整，用户仍然看到之前关注的内容
- 无缝的阅读体验

## 技术特点

- **性能优化**: 使用 `requestAnimationFrame` 确保DOM更新完成
- **内存管理**: 位置记录使用后自动清除
- **类型安全**: 完整的TypeScript类型支持
- **向后兼容**: 不影响现有的滚动功能

## 使用场景

- 聊天应用的历史消息加载
- 社交媒体的时间线加载
- 任何需要保持用户关注点的分页加载场景

## 注意事项

- 只在历史消息加载时触发，不影响新消息的自动滚动
- 需要确保容器ref正确传递
- 依赖DOM的滚动属性，确保容器支持滚动
