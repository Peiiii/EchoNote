# useLazyLoadingScrollControl Hook

A React Hook for maintaining scroll position during lazy loading or pagination scenarios.

## Usage

```typescript
import { useLazyLoadingScrollControl } from '@/common/features/chat/hooks/use-lazy-loading-scroll-control';

const MyComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { recordScrollPosition, restoreScrollPosition } = useLazyLoadingScrollControl({ containerRef });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(e);
    recordScrollPosition();
  }, [onScroll, recordScrollPosition]);

  useEffect(() => {
    return onContentLoaded$?.listen(() => {
      restoreScrollPosition();
    });
  }, [onContentLoaded$, restoreScrollPosition]);

  return (
    <div ref={containerRef} onScroll={handleScroll}>
      {/* Content */}
    </div>
  );
};
```

## API

```typescript
{
  containerRef: React.RefObject<HTMLDivElement | null>
}
```

**Returns:**
- `recordScrollPosition: () => void` - Record current scroll position
- `restoreScrollPosition: () => void` - Restore scroll position after content change

## How It Works

1. **Scroll** → `recordScrollPosition()`
2. **Load Content** → Trigger lazy loading
3. **Content Ready** → Fire event
4. **Restore** → `restoreScrollPosition()`

## Requirements

- Scrollable container with stable `ref`
- Content should be added (not removed)
- RxJS event system integration
