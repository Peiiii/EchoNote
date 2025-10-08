import { useReadMoreStore } from '@/common/features/read-more/store/read-more.store'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

interface UseChatAutoScrollOptions<T extends HTMLElement = HTMLDivElement> {
  threshold?: number // px, distance from bottom to auto sticky
  deps?: unknown[] // dependencies, usually message array
  scrollContainerRef: RefObject<T | null>
}

export function useChatAutoScroll<T extends HTMLElement = HTMLDivElement>({
  scrollContainerRef,
  threshold = 30,
  deps = [],
}: UseChatAutoScrollOptions<T>) {
  const [isSticky, setIsSticky] = useState(false) // 改为 false，让滚动按钮默认显示
  const lastScrollHeight = useRef(0)
  const activateAutoScrollSuppression = useReadMoreStore((state) => state.activateAutoScrollSuppression)
  // Scroll to bottom with optional smooth animation
  const scrollToBottom = useCallback((options: { smooth?: boolean } = {}) => {
    const el = scrollContainerRef.current
    if (el) {
      if (options.smooth) {
        // 使用 smooth 滚动行为，提供优雅的过渡效果
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        })
      } else {
        // 默认行为：直接跳转到底部
        el.scrollTop = el.scrollHeight
      }
    }
  }, [scrollContainerRef])

  // Listen to user scroll, determine if sticky
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setIsSticky(distanceToBottom <= threshold)
  }, [threshold, scrollContainerRef])

  // Auto scroll to bottom when dependencies change (e.g. new messages)
  useEffect(() => {
    if (isSticky) {
      scrollToBottom()
    }
    // Record last height
    if (scrollContainerRef.current) {
      lastScrollHeight.current = scrollContainerRef.current.scrollHeight
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)


  // In sticky mode, monitor height changes and auto scroll to bottom
  useEffect(() => {
    if (!isSticky) return
    const el = scrollContainerRef.current
    if (!el) return
    let frame: number | null = null
    const check = () => {
      if (!el) return
      if (el.scrollHeight !== lastScrollHeight.current) {
        const shouldSuppress = useReadMoreStore.getState().shouldSuppressAutoScrollNow()
        if (!shouldSuppress) {
          scrollToBottom()
        }else {
          // extend the suppression time
          activateAutoScrollSuppression()
        }
        lastScrollHeight.current = el.scrollHeight
      }
      frame = requestAnimationFrame(check)
    }
    frame = requestAnimationFrame(check)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isSticky, scrollContainerRef, activateAutoScrollSuppression, scrollToBottom])

  // Bind scroll event
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const onScroll = () => {
      handleScroll()
      // lastScrollHeight.current = el.scrollHeight
    }
    el.addEventListener('scroll', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
    }
  }, [handleScroll, scrollContainerRef])

  return {
    isSticky,
    scrollToBottom,
    setSticky: setIsSticky,
  }
} 
