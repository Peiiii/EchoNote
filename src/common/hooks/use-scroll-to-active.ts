import { useEffect } from "react";

interface ScrollToActiveConfig {
  activeId: string | null;
  scrollBehavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  enabled?: boolean;
}

export function useScrollToActive({
  activeId,
  scrollBehavior = "smooth",
  block = "nearest",
  enabled = true,
}: ScrollToActiveConfig) {
  useEffect(() => {
    if (!enabled || !activeId) return;
    
    const element = document.getElementById(activeId);
    if (element) {
      element.scrollIntoView({ 
        behavior: scrollBehavior, 
        block 
      });
    }
  }, [activeId, scrollBehavior, block, enabled]);
}
