import { useState, useEffect, useRef } from 'react';

interface UseSmartLoadingOptions {
  minDisplayTime?: number; // 最小显示时间 (ms)
}

export const useSmartLoading = (
  isLoading: boolean,
  options: UseSmartLoadingOptions = {}
) => {
  const {
    minDisplayTime = 0,
  } = options;

  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);
  const startTimeRef = useRef<number>(0);
  const minDisplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoading) {
      // 开始加载
      startTimeRef.current = Date.now();
      setShouldShowSkeleton(true);
      
    } else {
      // 加载完成
      const elapsedTime = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      // 确保最小显示时间
      if (remainingTime > 0) {
        minDisplayTimerRef.current = setTimeout(() => {
          setShouldShowSkeleton(false);
        }, remainingTime);
      } else {
        // 已经超过了最小显示时间，立即隐藏
        setShouldShowSkeleton(false);
      }
    }
    
    // 清理函数
    return () => {
      if (minDisplayTimerRef.current) clearTimeout(minDisplayTimerRef.current);
    };
  }, [isLoading, minDisplayTime]);

  return { shouldShowSkeleton };
};
