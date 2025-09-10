# Chat Layout Components

This directory contains the chat layout functionality, organized following component splitting rules for better maintainability and testing.

## Directory Structure

```
chat-layout/
├── index.tsx              # Main ChatLayout component (entry point)
├── types.ts               # Type definitions and interfaces
├── components/            # Sub-components
│   ├── index.ts          # Component exports
│   ├── left-sidebar.tsx  # Left sidebar with collapsible functionality
│   └── content-area.tsx  # Main content area with resizable panels
└── README.md              # This documentation
```

## Components

### ChatLayout (Main Component)
The main layout component that orchestrates the overall chat interface structure.

**Props:**
- `sidebar`: Left sidebar content
- `content`: Main chat content area
- `rightSidebar`: Optional right sidebar (threads, AI assistant, etc.)
- `className`: Additional CSS classes

**Usage:**
```tsx
<ChatLayout
    sidebar={<ChannelList />}
    content={<ChatContent />}
    rightSidebar={<ThreadSidebar />}
/>
```

### LeftSidebar
Handles the collapsible left sidebar functionality.

**Props:**
- `children`: Sidebar content
- `width`: Expanded width (default: "w-80")
- `collapsedWidth`: Collapsed width (default: "w-0")
- `className`: Additional CSS classes

**Features:**
- Collapsible with smooth animations
- Floating expand button when collapsed
- Responsive design

### ContentArea
Manages the main content area and optional right sidebar.

**Props:**
- `children`: Main content
- `rightSidebar`: Optional right sidebar content
- `className`: Additional CSS classes

**Features:**
- Resizable panels for content and right sidebar
- Automatic layout adjustment based on right sidebar presence
- Consistent sizing and spacing

## Design Principles

### Component Splitting Rules
Following the established component splitting rules:
- **Main component** kept simple and focused on orchestration
- **Sub-components** extracted for specific responsibilities
- **Types** separated for better maintainability
- **Directory structure** supports testing and future expansion

### Layout Architecture
- **Flexbox-based** layout system
- **Resizable panels** for dynamic content sizing
- **Collapsible sidebar** for space optimization
- **Responsive design** considerations

## Usage Examples

### Basic Layout
```tsx
import { ChatLayout } from "./chat-layout";

<ChatLayout
    sidebar={<ChannelList />}
    content={<ChatContent />}
/>
```

### With Right Sidebar
```tsx
<ChatLayout
    sidebar={<ChannelList />}
    content={<ChatContent />}
    rightSidebar={<ThreadSidebar />}
/>
```

### Custom Styling
```tsx
<ChatLayout
    sidebar={<ChannelList />}
    content={<ChatContent />}
    className="custom-layout-class"
/>
```

## Testing

The directory structure supports:
- **Unit testing** of individual components
- **Integration testing** of layout combinations
- **Mock components** for testing scenarios
- **Isolated testing** of sidebar and content areas

## Future Enhancements

Potential areas for expansion:
- **Layout presets** for different chat modes
- **Drag and drop** for panel reordering
- **Keyboard shortcuts** for layout control
- **Layout persistence** across sessions
- **Responsive breakpoints** for mobile optimization

## Dependencies

- `@/common/components/collapsible-sidebar` - Collapsible sidebar functionality
- `@/common/components/ui/resizable` - Resizable panel components
- React 18+ for hooks and context
- Tailwind CSS for styling
