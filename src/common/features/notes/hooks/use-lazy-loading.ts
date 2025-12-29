import { useCallback } from "react";

interface UseLazyLoadingProps {
  onTrigger: () => void;
  canTrigger: boolean;
  threshold?: number;
  direction?: 'top' | 'bottom';
  getState: () => {
    hasMore: boolean;
    loading: boolean;
    loadingMore: boolean;
  };
}

export const useLazyLoading = ({
  onTrigger,
  canTrigger,
  threshold = 0.2,
  direction = 'top',
  getState,
}: UseLazyLoadingProps) => {
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!canTrigger || !getState().hasMore || getState().loading || getState().loadingMore)
        return;

      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (direction === 'top') {
        // Near top
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        if (scrollPercentage < threshold) {
          onTrigger();
        }
      } else {
        // Near bottom
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        const bottomPercentage = distanceToBottom / (scrollHeight - clientHeight);
        if (bottomPercentage < threshold) {
          onTrigger();
        }
      }
    },
    [canTrigger, getState, threshold, onTrigger, direction]
  );

  return { handleScroll };
};
