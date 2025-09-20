import { useCallback, useEffect, useRef } from 'react'
import { computeFocusedId, collapseWithScrollTop, getFloatOffset } from '../core/collapse-utils'
import { useReadMoreStore, selectShowFloatingCollapse } from '../store/read-more.store'

/**
 * Checks if the inline collapse button for a specific message is overlapped by the container bottom edge
 * @param container - The scrollable container element
 * @param messageId - The ID of the message to check
 * @returns True if the inline button is overlapped and should be replaced by floating button
 */
function checkInlineButtonOverlap(container: HTMLElement, messageId: string): boolean {
  const inlineBtn = container.querySelector(`[data-collapse-inline-for="${messageId}"]`) as HTMLElement | null
  if (!inlineBtn) return false

  const containerRect = container.getBoundingClientRect()
  const buttonRect = inlineBtn.getBoundingClientRect()
  const floatOffset = getFloatOffset(container)
  
  const distanceFromBottom = containerRect.bottom - buttonRect.bottom
  return distanceFromBottom <= floatOffset + 0.5
}

/**
 * Updates the focus state and overlap detection for the current scroll position
 * @param container - The scrollable container element
 * @param setFocusInfo - Function to update the focus and overlap state in the store
 */
function updateFocusAndOverlapState(
  container: HTMLElement,
  setFocusInfo: (focusedId: string | null, inlineOverlap: boolean) => void
) {
  const focusedMessageId = computeFocusedId(container)
  const inlineOverlap = focusedMessageId ? checkInlineButtonOverlap(container, focusedMessageId) : false
  setFocusInfo(focusedMessageId, inlineOverlap)
}

/**
 * Custom hook for managing global collapse functionality across a scrollable container
 * Provides scroll handling, focus detection, and collapse operations for read-more components
 * @param containerRef - Reference to the scrollable container element
 * @returns Object containing collapse state and control functions
 */
export function useGlobalCollapse(containerRef: React.RefObject<HTMLDivElement | null>) {
  const showFloatingCollapse = useReadMoreStore(selectShowFloatingCollapse)
  const requestCollapse = useReadMoreStore(useCallback(state => state.requestCollapse, []))
  const setFocusInfo = useReadMoreStore(useCallback(state => state.setFocusInfo, []))

  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  /**
   * Handles scroll events to update focus and overlap detection
   * Uses requestAnimationFrame for performance optimization
   */
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      updateFocusAndOverlapState(container, setFocusInfo)
    })
  }, [containerRef, setFocusInfo])

  /**
   * Collapses the currently focused message with intelligent scroll behavior
   * If the message top is not visible, scrolls to align it with container top
   */
  const collapseCurrent = useCallback(() => {
    const state = useReadMoreStore.getState()
    const id = state.focusedId
    const container = containerRef.current
    if (!id || !container) return
    const element = container.querySelector(`[data-message-id="${id}"]`) as HTMLElement | null
    if (!element) return
    const cRect = container.getBoundingClientRect()
    const topVisible = element.getBoundingClientRect().top >= cRect.top
    collapseWithScrollTop({
      container,
      element,
      topVisibleBefore: topVisible,
      onCollapse: () => requestCollapse(id),
    })
  }, [containerRef, requestCollapse])

  return { showFloatingCollapse, handleScroll, collapseCurrent }
}
