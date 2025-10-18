# Imperative Modal System

A world-class, command-based modal system with minimal configuration and maximum functionality.

## Features

- **Command-based API**: Simple function calls to show/hide modals
- **Multiple Modal Stacking**: Support for multiple modals simultaneously
- **World-class Interactions**: Smooth animations, gestures, keyboard navigation
- **Zero Business Dependencies**: Completely portable and reusable
- **Minimal Configuration**: Only essential parameters, smart defaults for everything else

## Quick Start

```typescript
import { modal } from '@/common/lib/imperative-modal';

// Show a modal
const controller = modal.show(<MyComponent />, {
  className: "custom-styles",
  onClose: (result) => console.log('Modal closed with:', result)
});

// Close the modal
controller.close('some result');
```

## API Reference

### `modal.show(content, options?)`

Shows a modal with the given content.

**Parameters:**
- `content: ReactNode` - The React component to display
- `options?: ModalOptions` - Optional configuration

**Returns:** `ModalController` - Object to control the modal

### `modal.hide(id, result?)`

Hides a modal by ID.

**Parameters:**
- `id: string` - The modal ID returned from `show()`
- `result?: unknown` - Optional result to pass to onClose callback

### `modal.hideAll()`

Hides all open modals.

### `ModalOptions`

```typescript
interface ModalOptions {
  className?: string;           // Custom CSS classes
  onClose?: (result?: unknown) => void;  // Callback when modal closes
  position?: 'center' | 'top';  // Modal position
  topOffset?: number;          // Top offset in Tailwind units (e.g., 4 = 1rem)
}
```

### `ModalController`

```typescript
interface ModalController {
  close: (result?: unknown) => void;  // Close the modal
  id: string;                        // Unique modal ID
}
```

## Built-in Features

The modal system automatically provides:

- ✅ **Esc key** to close
- ✅ **Click outside** to close  
- ✅ **Scroll locking** to prevent background scrolling
- ✅ **Focus trapping** for keyboard navigation
- ✅ **Smooth animations** (fade + slide)
- ✅ **Mobile gestures** (swipe down to close)
- ✅ **Multiple modal stacking** with proper z-index
- ✅ **Mobile responsive** (fullscreen on mobile)

## Examples

### Basic Usage

```typescript
import { modal } from '@/common/lib/imperative-modal';

function MyComponent() {
  const handleOpenModal = () => {
    modal.show(
      <div>
        <h2>Hello World</h2>
        <p>This is a modal!</p>
      </div>
    );
  };

  return <button onClick={handleOpenModal}>Open Modal</button>;
}
```

### With Callback

```typescript
const controller = modal.show(
  <ConfirmationDialog />,
  {
    onClose: (confirmed) => {
      if (confirmed) {
        console.log('User confirmed');
      }
    }
  }
);
```

### Custom Styling

```typescript
modal.show(
  <MyContent />,
  {
    className: "w-96 h-64 bg-blue-100",
    onClose: () => console.log('Closed')
  }
);
```

### Fixed Position (Like VSCode Cmd+P)

```typescript
modal.show(
  <SearchContent />,
  {
    position: 'top',
    topOffset: 4, // 1rem from top
    className: "w-screen max-w-2xl"
  }
);
```

## Integration

Add the `ModalRenderer` to your app root:

```typescript
import { ModalRenderer } from '@/common/lib/imperative-modal';

export function App() {
  return (
    <div>
      <YourAppContent />
      <ModalRenderer />
    </div>
  );
}
```

## Migration from Store-based Modals

**Before:**
```typescript
// Old store-based approach
const { open, setOpen } = useQuickSearchModalStore();

<QuickSearchModal open={open} onOpenChange={setOpen} />
```

**After:**
```typescript
// New command-based approach
import { openQuickSearchModal } from './quick-search-modal';

// Just call the function
openQuickSearchModal();
```

## Architecture

The system uses:

- **RxJS BehaviorSubject** for state management
- **Framer Motion** for smooth animations
- **Custom hooks** for focus management and gestures
- **Zero React Context** - completely decoupled

This makes it highly performant and easy to use anywhere in your application.
