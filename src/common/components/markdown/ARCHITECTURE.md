# Markdown Components Architecture

## Overview

This document describes the architecture of the refactored Markdown components system, which provides reusable, world-class Markdown rendering capabilities across desktop and mobile platforms.

## Component Structure

```
src/common/components/markdown/
├── index.tsx                    # Main exports
├── markdown-content.tsx         # Desktop-optimized Markdown renderer
├── mobile-markdown-content.tsx  # Mobile-optimized Markdown renderer
├── code-block.tsx              # Standalone code block component
├── README.md                   # Usage documentation
└── ARCHITECTURE.md             # This architecture document
```

## Design Principles

### 1. **Separation of Concerns**
- **CodeBlock**: Handles only code rendering and copy functionality
- **MarkdownContent**: Desktop-specific styling and layout
- **MobileMarkdownContent**: Mobile-specific optimizations

### 2. **Reusability**
- Components can be imported from `@/common/components/markdown`
- Consistent API across all platforms
- Easy to extend and customize

### 3. **Platform Optimization**
- Desktop: Rich styling, hover effects, complex layouts
- Mobile: Touch-friendly spacing, simplified interactions, responsive design

## Component Details

### CodeBlock Component

**Purpose**: Renders code blocks with copy functionality and syntax highlighting

**Features**:
- Language detection from className
- Inline vs block code distinction
- Copy to clipboard with visual feedback
- World-class design inspired by GitHub/Notion

**Props**:
```typescript
interface CodeBlockProps {
    className?: string;        // Language class (e.g., "language-javascript")
    children?: React.ReactNode; // Code content
}
```

### MarkdownContent Component

**Purpose**: Desktop-optimized Markdown renderer with enhanced styling

**Features**:
- Rich typography and spacing
- Hover effects and interactions
- Complex layout support
- Full dark mode support

### MobileMarkdownContent Component

**Purpose**: Mobile-optimized Markdown renderer

**Features**:
- Touch-friendly spacing
- Simplified interactions
- Responsive design
- Mobile-specific styling

## Integration Points

### Desktop Integration
```typescript
// Old way
import { MarkdownContent } from "./markdown-content";

// New way
import { MarkdownContentWrapper as MarkdownContent } from "./markdown-content";
```

### Mobile Integration
```typescript
// Old way
import { MobileMarkdownContent } from "./mobile-markdown-content";

// New way
import { MobileMarkdownContentWrapper as MobileMarkdownContent } from "./mobile-markdown-content";
```

### Direct Usage
```typescript
import { MarkdownContent, MobileMarkdownContent, CodeBlock } from '@/common/components/markdown';
```

## Migration Strategy

### Phase 1: Component Creation
- ✅ Created reusable components in `src/common/components/markdown/`
- ✅ Implemented world-class design and functionality
- ✅ Added mobile optimization

### Phase 2: Integration
- ✅ Updated desktop components to use new system
- ✅ Updated mobile components to use new system
- ✅ Maintained backward compatibility through wrapper components

### Phase 3: Cleanup
- ✅ Removed duplicate code
- ✅ Standardized imports
- ✅ Added comprehensive documentation

## Benefits

### 1. **Code Quality**
- Single source of truth for Markdown rendering
- Consistent styling across platforms
- Easier maintenance and updates

### 2. **Developer Experience**
- Clear import paths
- Comprehensive documentation
- Type-safe interfaces

### 3. **Performance**
- Shared components reduce bundle size
- Optimized for each platform
- Efficient re-rendering

### 4. **Maintainability**
- Centralized styling logic
- Easy to add new features
- Consistent design language

## Future Enhancements

### 1. **Syntax Highlighting**
- Integration with Prism.js or highlight.js
- Custom theme support
- Language-specific optimizations

### 2. **Interactive Elements**
- Collapsible sections
- Copy buttons for all code blocks
- Custom block types

### 3. **Accessibility**
- Screen reader optimizations
- Keyboard navigation
- High contrast themes

### 4. **Performance**
- Lazy loading for large documents
- Virtual scrolling for long content
- Memoization optimizations

## Best Practices

### 1. **Import Usage**
```typescript
// ✅ Correct: Import from common components
import { MarkdownContent } from '@/common/components/markdown';

// ❌ Incorrect: Import from local files
import { MarkdownContent } from './markdown-content';
```

### 2. **Component Composition**
```typescript
// ✅ Correct: Use wrapper components for platform-specific needs
export function MyComponent() {
    return <MarkdownContentWrapper content={content} />;
}

// ❌ Incorrect: Direct usage without considering platform
export function MyComponent() {
    return <MarkdownContent content={content} />;
}
```

### 3. **Styling Customization**
```typescript
// ✅ Correct: Pass className for custom styling
<MarkdownContent content={content} className="custom-prose" />

// ❌ Incorrect: Modify component internals
// Don't edit the common component files directly
```

## Conclusion

The refactored Markdown components system provides a solid foundation for consistent, high-quality Markdown rendering across all platforms. The architecture promotes code reuse, maintainability, and platform-specific optimization while maintaining a clean and intuitive API.
