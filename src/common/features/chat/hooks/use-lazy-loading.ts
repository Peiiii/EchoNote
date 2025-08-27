import { useCallback } from 'react';

interface UseLazyLoadingProps {
  onTrigger: () => void;
  canTrigger: boolean;
  threshold?: number;
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
  getState
}: UseLazyLoadingProps) => {
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!canTrigger || !getState().hasMore || getState().loading || getState().loadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    if (scrollPercentage < threshold) {
      onTrigger();
    }
  }, [canTrigger, getState, threshold, onTrigger]);

  return { handleScroll };
};
