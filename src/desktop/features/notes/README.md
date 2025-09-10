# Chat Feature Components

This directory contains the chat functionality components for the desktop application, organized for maintainability and reusability.

## 📁 Directory Structure

```
src/desktop/features/notes/
├── components/                    # Chat UI components
│   ├── index.ts                  # Unified exports
│   ├── chat-layout.tsx           # Main layout component
│   ├── chat-content.tsx          # Content area layout
│   ├── message-input.tsx         # Message input component
│   ├── channel-list/             # Channel management
│   │   ├── index.tsx
│   │   ├── channel-item.tsx
│   │   ├── channel-icons.tsx
│   │   └── create-channel-popover.tsx
│   ├── message-timeline/         # Message display
│   │   ├── index.tsx
│   │   ├── thought-record.tsx
│   │   ├── empty-state.tsx
│   │   ├── date-divider.tsx
│   │   └── hooks.ts
│   ├── ui/                       # Reusable UI components
│   │   ├── scroll-to-bottom-button.tsx
│   │   └── message-timeline-container.tsx
│   └── features/                 # Feature-specific components
│       └── thread-sidebar.tsx
├── hooks/                        # Custom hooks
│   └── use-chat-page.ts
├── pages/                        # Page components
│   └── chat-page.tsx
└── README.md                     # This file
```

## 🧩 Component Architecture

### Layout Components
- **ChatLayout**: Main layout wrapper with sidebar and content areas
- **ChatContent**: Content area layout with timeline, input, and scroll button

### Core Components
- **MessageInput**: Message composition and sending
- **ChannelList**: Channel navigation and management
- **MessageTimeline**: Message display with grouping and threading

### UI Components
- **ScrollToBottomButton**: Auto-scroll functionality
- **MessageTimelineContainer**: Scrollable message container

### Feature Components
- **ThreadSidebar**: Thread conversation management

## 🔧 Usage

### Basic Chat Page
```tsx
import { ChatPage } from "./pages/chat-page";

// The main chat page component
<ChatPage />
```

### Custom Layout
```tsx
import { ChatLayout, ChatContent, ChannelList, MessageInput } from "./components";

<ChatLayout
  sidebar={<ChannelList />}
  content={
    <ChatContent
      timeline={<YourTimelineComponent />}
      input={<MessageInput onSend={handleSend} />}
      scrollButton={<ScrollToBottomButton onClick={scrollToBottom} />}
    />
  }
/>
```

### Using Custom Hooks
```tsx
import { useChatPage } from "./hooks/use-chat-page";

const {
  replyToMessageId,
  isSticky,
  containerRef,
  handleSend,
  handleCancelReply,
  handleScrollToBottom
} = useChatPage();
```

## 🎯 Design Principles

### 1. **Single Responsibility**
Each component has a single, well-defined purpose:
- Layout components handle structure
- UI components handle presentation
- Feature components handle business logic

### 2. **Composition Over Inheritance**
Components are designed to be composed together:
- Props-based configuration
- Flexible content injection
- Reusable patterns

### 3. **Separation of Concerns**
- UI logic separated from business logic
- Custom hooks for state management
- Clear component boundaries

### 4. **Maintainability**
- Consistent naming conventions
- Modular file structure
- Clear import/export patterns

## 📦 Component Exports

All components are exported through the main `index.ts`:

```tsx
// Layout components
export { ChatLayout } from "./chat-layout";
export { ChatContent } from "./chat-content";

// UI components  
export { ScrollToBottomButton } from "./ui/scroll-to-bottom-button";
export { MessageTimelineContainer } from "./ui/message-timeline-container";

// Feature components
export { ThreadSidebar } from "./features/thread-sidebar";

// Existing components
export { ChannelList } from "./channel-list";
export { MessageInput } from "./message-input";
export { MessageTimeline } from "./message-timeline";
```

## 🔄 State Management

Chat state is managed through:
- **useChatDataStore**: Global chat data state (messages, channels)
- **useChatViewStore**: Global chat view state (current channel, GitHub sync)
- **useChatAutoScroll**: Scroll behavior management

## 🎨 Styling

Components use:
- **Tailwind CSS**: Utility-first styling
- **Dark mode support**: Consistent theming
- **Responsive design**: Mobile-friendly layouts
- **Accessibility**: WCAG compliant components

## 🧪 Testing

Components are designed for easy testing:
- Isolated functionality
- Clear interfaces
- Mockable dependencies
- Predictable behavior

## 🚀 Performance

Optimizations include:
- **React.memo**: Prevent unnecessary re-renders
- **useCallback**: Stable function references
- **Virtual scrolling**: For large message lists
- **Lazy loading**: For heavy components

## 📝 Development Guidelines

1. **Naming**: Use kebab-case for files, PascalCase for components
2. **Imports**: Use the main index.ts for component imports
3. **Props**: Define clear interfaces for all props
4. **Documentation**: Add JSDoc comments for complex components
5. **Testing**: Write unit tests for business logic

## 🔗 Dependencies

- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Custom hooks**: State management
