import { useEffect } from "react";

interface KeyboardNavigationConfig<T = unknown> {
  items: T[];
  activeIndex: number;
  setActiveIndex: (index: number | ((prev: number) => number)) => void;
  onSelect?: (item: T, index: number) => void;
  onEscape?: () => void;
  onTab?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation<T = unknown>({
  items,
  activeIndex,
  setActiveIndex,
  onSelect,
  onEscape,
  onTab,
  enabled = true,
}: KeyboardNavigationConfig<T>) {
  useEffect(() => {
    if (!enabled) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
        return;
      }
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i: number) => Math.min(i + 1, Math.max(0, items.length - 1)));
        return;
      }
      
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i: number) => Math.max(0, i - 1));
        return;
      }
      
      if (e.key === "Tab") {
        e.preventDefault();
        onTab?.();
        return;
      }
      
      if (e.key === "Enter") {
        if (items[activeIndex]) {
          e.preventDefault();
          onSelect?.(items[activeIndex], activeIndex);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, activeIndex, setActiveIndex, onSelect, onEscape, onTab, enabled]);
}
