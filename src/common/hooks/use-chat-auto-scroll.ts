import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

interface UseChatAutoScrollOptions {
  threshold?: number // px, distance from bottom to auto sticky
  deps?: unknown[] // dependencies, usually message array
}

export function useChatAutoScroll<T extends HTMLElement = HTMLDivElement>(containerRef: RefObject<T | null>, {
  threshold = 30,
  deps = [],
}: UseChatAutoScrollOptions = {}) {
  const [isSticky, setIsSticky] = useState(true)
  const lastScrollHeight = useRef(0)

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const el = containerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [containerRef])

  // Listen to user scroll, determine if sticky
  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setIsSticky(distanceToBottom <= threshold)
  }, [threshold, containerRef])

  // Auto scroll to bottom when dependencies change (e.g. new messages)
  useEffect(() => {
    if (isSticky) {
      scrollToBottom()
    }
    // Record last height
    if (containerRef.current) {
      lastScrollHeight.current = containerRef.current.scrollHeight
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  // In sticky mode, monitor height changes and auto scroll to bottom
  useEffect(() => {
    if (!isSticky) return
    const el = containerRef.current
    if (!el) return
    let frame: number | null = null
    const check = () => {
      if (!el) return
      if (el.scrollHeight !== lastScrollHeight.current) {
        scrollToBottom()
        lastScrollHeight.current = el.scrollHeight
      }
      frame = requestAnimationFrame(check)
    }
    frame = requestAnimationFrame(check)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isSticky, containerRef, scrollToBottom])

  // Bind scroll event
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll)
    return () => {
      el.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, containerRef])

  return {
    isSticky,
    scrollToBottom,
    setSticky: setIsSticky,
  }
} 