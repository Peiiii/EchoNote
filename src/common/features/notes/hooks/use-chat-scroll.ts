import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";
import { useMemoizedFn } from "ahooks";
import { useEffect, useState } from "react";

export const checkCanScrollToBottom = (element: HTMLElement | null, threshold: number = 5) => {
  if (!element) return false;

  const { scrollTop, clientHeight, scrollHeight } = element;
  const distanceToBottom = scrollHeight - scrollTop - clientHeight;

  return distanceToBottom > threshold;
};

export const useChatScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  deps: unknown[] = [],
  options: { smoothScroll?: boolean; threshold?: number } = {}
) => {
  const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll({
    scrollContainerRef: containerRef,
    threshold: options.threshold ?? 30,
    deps,
  });

  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setShowScrollToBottomButton(checkCanScrollToBottom(container, options.threshold ?? 30));
      const handleScroll = () => {
        setShowScrollToBottomButton(checkCanScrollToBottom(container, options.threshold ?? 30));
      };
      container.addEventListener("scroll", handleScroll);
      return () => {
        container?.removeEventListener("scroll", handleScroll);
      };
    }
  }, [containerRef, options.threshold]);

  const handleScrollToBottom = useMemoizedFn((options?: { behavior?: "smooth" | "instant" }) => {
    setSticky(true);
    scrollToBottom({ smooth: options?.behavior === "smooth" });
  });

  return {
    containerRef,
    isSticky,
    scrollToBottom: handleScrollToBottom,
    showScrollToBottomButton,
  };
};
