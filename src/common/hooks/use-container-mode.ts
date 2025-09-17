import { useLayoutEffect, useState } from 'react';

// Observe a container element and return layout mode based on its width.
// Useful for master-detail that must react to resizable parents instead of window breakpoints.
export type ContainerMode = 'two-pane' | 'single-pane';

export interface ContainerModeOptions {
  sidebar?: number; // expected sidebar width in px
  chatMin?: number; // minimum content width in px
  gutter?: number;  // extra spacing in px
}

export function useContainerMode(
  ref: React.RefObject<HTMLElement | null>,
  opts?: ContainerModeOptions
): ContainerMode {
  const { sidebar = 320, chatMin = 520, gutter = 0 } = opts || {};
  const [mode, setMode] = useState<ContainerMode>('two-pane');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const required = sidebar + chatMin + gutter;
    const ro = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setMode(width >= required ? 'two-pane' : 'single-pane');
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, sidebar, chatMin, gutter]);

  return mode;
}

