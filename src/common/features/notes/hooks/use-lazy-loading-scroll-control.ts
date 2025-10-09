import { useRef, useCallback } from "react";

export const useLazyLoadingScrollControl = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const scrollPositionRef = useRef<{
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  } | null>(null);

  const recordScrollPosition = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    scrollPositionRef.current = {
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
      clientHeight: container.clientHeight,
    };
  }, [containerRef]);

  const restoreScrollPosition = useCallback(() => {
    if (!scrollPositionRef.current || !containerRef.current) return;

    const { scrollTop, scrollHeight } = scrollPositionRef.current;
    const container = containerRef.current;

    // 等待DOM更新完成
    requestAnimationFrame(() => {
      if (!container) return;

      const newScrollHeight = container.scrollHeight;
      const oldScrollHeight = scrollHeight;

      // 计算新增内容的高度
      const addedHeight = newScrollHeight - oldScrollHeight;

      // 调整滚动位置，保持用户关注的相对位置
      if (addedHeight > 0) {
        // container.scrollTop = scrollTop + addedHeight;
        container.scrollTo({ top: scrollTop + addedHeight, behavior: "instant" });
      }

      // 清除记录的位置
      scrollPositionRef.current = null;
    });
  }, [containerRef]);

  return {
    recordScrollPosition,
    restoreScrollPosition,
  };
};
