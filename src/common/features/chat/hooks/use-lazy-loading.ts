import { RefObject, useCallback } from 'react';

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
};
