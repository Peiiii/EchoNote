import { useCallback, useEffect, useRef } from 'react'
import { collapseWithScrollTop, getFloatOffset } from '../core/collapse-utils'
import { useReadMoreStore, selectShowFloatingCollapse } from '../store/read-more.store'

function findBottomCandidate(container: HTMLElement) {
  const nodes = Array.from(container.querySelectorAll('[data-message-id]')) as HTMLElement[]
  if (!nodes.length) {
    return { id: null as string | null, inlineOverlap: false, visibleHeight: null as number | null }
  }

  const cRect = container.getBoundingClientRect()
  let best: { id: string; distance: number; rect: DOMRect } | null = null

  for (const node of nodes) {
    const rect = node.getBoundingClientRect()
    if (rect.bottom < cRect.top || rect.top > cRect.bottom) continue
    const id = node.getAttribute('data-message-id')
    if (!id) continue
    const distance = Math.max(0, cRect.bottom - rect.bottom)
    if (!best || distance < best.distance) {
      best = { id, distance, rect }
    }
  }

  if (!best) {
    return { id: null as string | null, inlineOverlap: false, visibleHeight: null as number | null }
  }

  const inlineBtn = container.querySelector(`[data-collapse-inline-for="${best.id}"]`) as HTMLElement | null
  const btnRect = inlineBtn?.getBoundingClientRect()
  const offset = getFloatOffset(container)
  const inlineOverlap = btnRect ? (cRect.bottom - btnRect.bottom) <= offset + 0.5 : false
  const visibleHeight = Math.max(
    0,
    Math.min(cRect.bottom, best.rect.bottom) - Math.max(cRect.top, best.rect.top)
  )

  return { id: best.id, inlineOverlap, visibleHeight }
}

export function useGlobalCollapse(containerRef: React.RefObject<HTMLDivElement | null>) {
  const showFloatingCollapse = useReadMoreStore(selectShowFloatingCollapse)
  const requestCollapse = useReadMoreStore(useCallback(state => state.requestCollapse, []))
  const setActiveInfo = useReadMoreStore(useCallback(state => state.setActiveInfo, []))

  const rafRef = useRef<number | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)

  // Defer active message recompute to next frame so multiple observer events coalesce.
  const scheduleUpdate = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const { id, inlineOverlap, visibleHeight } = findBottomCandidate(container)
      setActiveInfo(id, inlineOverlap, visibleHeight)
    })
  }, [containerRef, setActiveInfo])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    intersectionObserverRef.current?.disconnect()
    mutationObserverRef.current?.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Track partial visibility to capture expand/collapse without relying solely on scroll.
    const thresholds = Array.from({ length: 11 }, (_, index) => index / 10)
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.length) return
        scheduleUpdate()
      },
      { root: container, threshold: thresholds }
    )
    intersectionObserverRef.current = observer

    const observeMessages = () => {
      observer.disconnect()
      const nodes = container.querySelectorAll('[data-message-id]')
      nodes.forEach((node) => observer.observe(node))
    }

    observeMessages()

    const mutationObserver = new MutationObserver(() => {
      observeMessages()
      scheduleUpdate()
    })
    mutationObserver.observe(container, { childList: true, subtree: true })
    mutationObserverRef.current = mutationObserver

    scheduleUpdate()

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [containerRef, scheduleUpdate])

  useEffect(() => {
    window.addEventListener('resize', scheduleUpdate)
    return () => window.removeEventListener('resize', scheduleUpdate)
  }, [scheduleUpdate])

  const handleScroll = useCallback(() => {
    scheduleUpdate()
  }, [scheduleUpdate])

  const collapseCurrent = useCallback(() => {
    const state = useReadMoreStore.getState()
    const id = state.activeMessageId
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
