import { useEffect } from "react";

interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useSwipeGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enabled = true,
}: SwipeGestureConfig) {
  useEffect(() => {
    if (!enabled) return;

    let startY = 0;
    let startX = 0;
    let isSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isSwipe = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipe) {
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        isSwipe = deltaX > deltaY && deltaX > 10;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSwipe) {
        const deltaX = e.changedTouches[0].clientX - startX;
        const deltaY = e.changedTouches[0].clientY - startY;
        
        if (Math.abs(deltaX) > threshold) {
          e.preventDefault();
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        } else if (Math.abs(deltaY) > threshold) {
          e.preventDefault();
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, enabled]);
}
