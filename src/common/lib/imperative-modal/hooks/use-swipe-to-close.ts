import { useCallback, useRef } from "react";

interface SwipeToCloseOptions {
  onClose: () => void;
  threshold?: number;
}

export function useSwipeToClose({ onClose, threshold = 100 }: SwipeToCloseOptions) {
  const startY = useRef(0);
  const startX = useRef(0);
  const isSwipe = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    startX.current = e.touches[0].clientX;
    isSwipe.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipe.current) {
      const deltaY = Math.abs(e.touches[0].clientY - startY.current);
      const deltaX = Math.abs(e.touches[0].clientX - startX.current);
      isSwipe.current = deltaY > deltaX && deltaY > 10;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isSwipe.current) {
      const deltaY = e.changedTouches[0].clientY - startY.current;
      if (deltaY > threshold) {
        e.preventDefault();
        onClose();
      }
    }
  }, [onClose, threshold]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
