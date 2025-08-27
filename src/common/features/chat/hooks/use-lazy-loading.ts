import { RefObject, useCallback, useRef } from 'react';

interface UseLazyLoadingProps {
  onTrigger: () => void;
  canTrigger: boolean;
  threshold?: number;
  hasMoreRef: RefObject<boolean>;
  loadingRef: RefObject<boolean>;
  loadingMoreRef: RefObject<boolean>;
}

export const useLazyLoading = ({
  onTrigger,
  canTrigger,
  threshold = 0.2,
  hasMoreRef,
  loadingRef,
  loadingMoreRef
}: UseLazyLoadingProps) => {
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!canTrigger || !hasMoreRef.current || loadingRef.current || loadingMoreRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    if (scrollPercentage < threshold) {
      onTrigger();
    }
  }, [canTrigger, hasMoreRef, loadingRef, loadingMoreRef, threshold, onTrigger]);

  return { handleScroll };
};export const useLazyLoadingScrollControl = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null>; }) => {

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
            clientHeight: container.clientHeight
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
                container.scrollTo({ top: scrollTop + addedHeight, behavior: 'instant' });
            }

            // 清除记录的位置
            scrollPositionRef.current = null;
        });
    }, [containerRef]);

    return {
        recordScrollPosition,
        restoreScrollPosition
    };

};

