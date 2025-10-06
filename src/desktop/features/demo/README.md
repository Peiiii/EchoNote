# Demo Extension

This is an extension that demonstrates the usage of StillRoot's plugin architecture.

## Features

- ✅ Demonstrates basic usage of plugin architecture
- ✅ Shows activity bar state management
- ✅ Shows route state management  
- ✅ Shows icon state management
- ✅ Shows page container component usage

## Usage

1. Start development server: `pnpm dev`
2. Visit `http://localhost:5174/demo`
3. Click the "Demo" icon in the activity bar

## Page Container Component (PageContainer)

`PageContainer` is a unified page container component that solves the following issues:

- **Full Width Display**: Page content automatically fills available width
- **Scroll Support**: Automatically enables scrolling when content overflows
- **Unified Layout**: Provides consistent padding and layout structure
- **Flexible Configuration**: Supports custom max width, padding, centering, and other options

### Basic Usage

```tsx
import { PageContainer } from '@/common/components/page-container';

export function MyPage() {
  return (
    <PageContainer>
      <div>Page content</div>
    </PageContainer>
  );
}
```

### Advanced Configuration

```tsx
<PageContainer
  maxWidth="lg"        // Limit maximum width
  padding="lg"         // Use large padding
  centered={true}      // Center content
  scrollable={false}   // Disable scrolling
  className="custom"   // Custom styles
>
  <div>Page content</div>
</PageContainer>
```

## Plugin Architecture Overview

### Core Components

- **Extension Manager**: Extension lifecycle management
- **Activity Bar Store**: Activity bar state management, handles registration and state of activity bar items
- **Route Tree Store**: Route tree state management, handles dynamic route registration and state
- **Icon Store**: Icon state management, handles icon registration and mapping

### Extension Features

- **Dynamic Activity Bar Item Registration**: Extensions can dynamically add activity bar icons and items
- **Dynamic Route Node Registration**: Extensions can dynamically add route pages
- **Dynamic Icon Registration**: Extensions can register custom icons
- **Bidirectional Mapping Between Routes and Activity Bar**: Clicking activity bar items automatically navigates to corresponding routes

## Development Guide

### Creating New Extensions

1. Create a new feature directory under `src/desktop/features/`
2. Define the extension's manifest and activate function
3. Register activity bar items, routes, and icons
4. Register the extension in `desktop-app.tsx`

### Best Practices

- Use `PageContainer` to wrap page content
- Follow single responsibility principle, each extension should only handle one functional area
- Use `Disposable` to ensure proper resource cleanup
- Keep extensions decoupled, avoid direct dependencies 