import { useReadMoreStore } from "@/common/features/read-more/store/read-more.store";
import { useMemoizedFn } from "ahooks";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface UseChatAutoScrollOptions<T extends HTMLElement = HTMLDivElement> {
  threshold?: number; // px, distance from bottom to auto sticky
  deps?: unknown[]; // dependencies, usually message array
  scrollContainerRef: RefObject<T | null>;
}

export const useScrollHeightAfterLastScroll = ({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) => {
  const lastScrollHeightRef = useRef(0);
  useEffect(() => {
    if (scrollContainerRef.current) {
      lastScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
    }
  }, [scrollContainerRef]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    lastScrollHeightRef.current = el.scrollHeight;
    const onScroll = () => {
      lastScrollHeightRef.current = el.scrollHeight;
    };
    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  }, [lastScrollHeightRef, scrollContainerRef]);

  return {
    lastScrollHeightRef,
  };
};

export const useDetectScrollHeightChange = ({
  enableDetect,
  scrollContainerRef,
  handleScrollHeightChange,
}: {
  enableDetect: boolean;
  scrollContainerRef: RefObject<HTMLElement | null>;
  handleScrollHeightChange: () => void;
}) => {
  // Bind scroll event
  const { lastScrollHeightRef } = useScrollHeightAfterLastScroll({
    scrollContainerRef,
  });

  const memoizedhandleScrollHeightChange = useMemoizedFn(handleScrollHeightChange);

  // In sticky mode, monitor height changes and auto scroll to bottom
  useEffect(() => {
    if (!enableDetect) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    let frame: number | null = null;
    const check = () => {
      if (!el) return;
      // check if the scroll height has changed
      if (el.scrollHeight !== lastScrollHeightRef.current) {
        memoizedhandleScrollHeightChange();
      }
      frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enableDetect, scrollContainerRef, lastScrollHeightRef, memoizedhandleScrollHeightChange]);
};

export function useChatAutoScroll<T extends HTMLElement = HTMLDivElement>({
  scrollContainerRef,
  threshold = 30,
  deps = [],
}: UseChatAutoScrollOptions<T>) {
  const [isSticky, setIsSticky] = useState(false);
  // Scroll to bottom with optional smooth animation
  const scrollToBottom = useCallback(
    (options: { smooth?: boolean } = {}) => {
      const el = scrollContainerRef.current;
      if (el) {
        if (options.smooth) {
          // 使用 smooth 滚动行为，提供优雅的过渡效果
          el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
          });
        } else {
          // 默认行为：直接跳转到底部
          el.scrollTop = el.scrollHeight;
        }
      }
    },
    [scrollContainerRef]
  );

  // Listen to user scroll, determine if sticky
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsSticky(distanceToBottom <= threshold);
  }, [threshold, scrollContainerRef]);

  // Auto scroll to bottom when dependencies change (e.g. new messages)
  useEffect(() => {
    if (isSticky) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Bind scroll event
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, scrollContainerRef]);

  // In sticky mode, monitor height changes and auto scroll to bottom

  useDetectScrollHeightChange({
    enableDetect: isSticky,
    scrollContainerRef,
    handleScrollHeightChange: () => {
      const shouldSuppress = useReadMoreStore.getState().shouldSuppressAutoScrollNow();
      if (!shouldSuppress) {
        scrollToBottom();
      } else {
        // extend the suppression time
        useReadMoreStore.getState().activateAutoScrollSuppression();
      }
    },
  });

  return {
    isSticky,
    scrollToBottom,
    setSticky: setIsSticky,
  };
}
