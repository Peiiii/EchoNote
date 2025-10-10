import { useState, useCallback } from 'react';

interface UseZoomOptions {
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

export function useZoom({
  minScale = 0.1,
  maxScale = 5,
  initialScale = 1,
}: UseZoomOptions = {}) {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastWheelTime, setLastWheelTime] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, scale, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastWheelTime < 16) {
      return;
    }
    setLastWheelTime(now);
    
    const scrollIntensity = Math.abs(e.deltaY);
    let delta;
    
    if (scrollIntensity < 50) {
      delta = e.deltaY > 0 ? 0.98 : 1.02;
    } else if (scrollIntensity < 100) {
      delta = e.deltaY > 0 ? 0.96 : 1.04;
    } else {
      delta = e.deltaY > 0 ? 0.94 : 1.06;
    }
    
    const newScale = Math.max(minScale, Math.min(maxScale, scale * delta));
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [lastWheelTime, scale, minScale, maxScale]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(maxScale, prev * 1.1));
  }, [maxScale]);

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(minScale, prev * 0.9);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, [minScale]);

  const resetView = useCallback(() => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
  }, [initialScale]);

  const reset = useCallback(() => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [initialScale]);

  return {
    scale,
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    zoomIn,
    zoomOut,
    resetView,
    reset,
  };
}
