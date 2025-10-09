import { useLayoutEffect, useRef, useState } from "react";

export type ContainerMode = "two-pane" | "single-pane";

export interface ContainerModeOptions {
  sidebar?: number;
  chatMin?: number;
  gutter?: number;
  hysteresis?: number;
  debounceMs?: number;
}

export function useContainerMode(
  ref: React.RefObject<HTMLElement | null>,
  opts?: ContainerModeOptions
): { mode: ContainerMode; ready: boolean } {
  const {
    sidebar = 320,
    chatMin = 520,
    gutter = 0,
    hysteresis = 24,
    debounceMs = 100,
  } = opts || {};
  const [mode, setMode] = useState<ContainerMode>("two-pane");
  const [ready, setReady] = useState(false);
  const modeRef = useRef<ContainerMode>(mode);
  modeRef.current = mode;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const required = sidebar + chatMin + gutter;
    let t: ReturnType<typeof setTimeout> | null = null;
    const evaluate = () => {
      const width = el.clientWidth || el.getBoundingClientRect().width;
      const current = modeRef.current as ContainerMode;
      let next: ContainerMode;
      if (current === "two-pane") {
        next = width >= required - hysteresis ? "two-pane" : "single-pane";
      } else {
        next = width >= required + hysteresis ? "two-pane" : "single-pane";
      }
      if (next !== current) {
        modeRef.current = next;
        setMode(next);
      }
      setReady(true);
    };
    const schedule = () => {
      if (t) clearTimeout(t);
      t = setTimeout(evaluate, debounceMs);
    };
    evaluate();
    const ro = new ResizeObserver(() => schedule());
    ro.observe(el);
    return () => {
      if (t) clearTimeout(t);
      ro.disconnect();
    };
  }, [ref, sidebar, chatMin, gutter, hysteresis, debounceMs]);

  return { mode, ready };
}
