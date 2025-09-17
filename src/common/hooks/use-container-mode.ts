import { useLayoutEffect, useState } from 'react';

export type ContainerMode = 'two-pane' | 'single-pane';

export interface ContainerModeOptions {
  sidebar?: number;
  chatMin?: number;
  gutter?: number;
}

export function useContainerMode(
  ref: React.RefObject<HTMLElement | null>,
  opts?: ContainerModeOptions
): { mode: ContainerMode; ready: boolean } {
  const { sidebar = 320, chatMin = 520, gutter = 0 } = opts || {};
  const [mode, setMode] = useState<ContainerMode>('two-pane');
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const required = sidebar + chatMin + gutter;
    const measure = () => {
      const width = el.clientWidth || el.getBoundingClientRect().width;
      setMode(width >= required ? 'two-pane' : 'single-pane');
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, sidebar, chatMin, gutter]);

  return { mode, ready };
}
