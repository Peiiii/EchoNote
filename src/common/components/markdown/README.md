# Markdown Components

A collection of reusable Markdown components with world-class design and mobile optimization.

## Components

### MarkdownContent

The main desktop-optimized Markdown renderer with enhanced styling and components.

### MobileMarkdownContent

Mobile-optimized version with touch-friendly spacing and responsive design.

### CodeBlock

Standalone code block component with copy functionality and syntax highlighting support.

## Features

- **World-class Design**: Inspired by GitHub, Notion, and Vercel
- **Copy Code**: One-click code copying with visual feedback
- **Syntax Highlighting**: Language detection and display
- **Responsive**: Optimized for both desktop and mobile
- **Dark Mode**: Full dark mode support
- **Customizable**: Easy to extend and modify

## Usage

### Basic Usage

```tsx
import { MarkdownContent, MobileMarkdownContent } from '@/common/components/markdown';

// Desktop version
<MarkdownContent content="# Hello World" />

// Mobile version
<MobileMarkdownContent content="# Hello World" />
```

### With Custom Styling

```tsx
<MarkdownContent content={markdownText} className="custom-prose-class" />
```

### Standalone CodeBlock

```tsx
import { CodeBlock } from "@/common/components/markdown";

<CodeBlock className="language-javascript">
  {`function hello() {
    console.log('Hello World!');
}`}
</CodeBlock>;
```

## File Structure

```
src/common/components/markdown/
├── index.tsx                    # Main exports
├── markdown-content.tsx         # Desktop Markdown renderer
├── mobile-markdown-content.tsx  # Mobile Markdown renderer
├── code-block.tsx              # Standalone code block component
├── README.md                   # This documentation
└── ARCHITECTURE.md             # Architecture documentation
```

## Dependencies

- `react-markdown`: Core Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support
- `lucide-react`: Icons for copy functionality
- `tailwindcss`: Styling framework

## Integration

### Desktop Components

```tsx
import { MarkdownContent } from "@/common/components/markdown";
```

### Mobile Components

```tsx
import { MobileMarkdownContent } from "@/common/components/markdown";
```

### Direct Usage

```tsx
import { CodeBlock } from "@/common/components/markdown";
```

## Customization

The components are built with Tailwind CSS and can be easily customized by modifying the className props or extending the component styles.

## Browser Support

- Modern browsers with ES6+ support
- Requires Clipboard API for copy functionality
- Graceful fallback for older browsers
