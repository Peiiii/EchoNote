import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/common/lib/utils'
import { readMoreBus } from '../core/read-more.bus'

interface ReadMoreBaseWrapperProps {
  children: React.ReactNode
  messageId: string
  maxHeight: number
  clampMargin?: number
  className?: string
  gradientClassName?: string
  readMoreLabel?: string
  collapseLabel?: string
}

export function ReadMoreBaseWrapper({
  children,
  messageId,
  maxHeight,
  clampMargin = 0,
  className,
  gradientClassName,
  readMoreLabel = 'Read more',
  collapseLabel = 'Collapse',
}: ReadMoreBaseWrapperProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [collapseInlineVisible, setCollapseInlineVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const collapseBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!contentRef.current) return
    const contentHeight = contentRef.current.scrollHeight
    setShowReadMore(contentHeight > maxHeight + clampMargin)
  }, [children, maxHeight, clampMargin, isExpanded])

  useEffect(() => {
    readMoreBus.statusChanged$.emit({
      messageId,
      long: showReadMore,
      expanded: isExpanded,
      collapseInlineVisible: collapseInlineVisible && isExpanded && showReadMore,
    })
  }, [messageId, showReadMore, isExpanded, collapseInlineVisible])

  useEffect(() => {
    if (!isExpanded || !showReadMore) {
      setCollapseInlineVisible(false)
    }
  }, [isExpanded, showReadMore])

  useEffect(() => {
    const unsubscribe = readMoreBus.requestCollapse$.listen(({ messageId: target }) => {
      if (target === messageId) {
        setIsExpanded(false)
      }
    })
    return () => unsubscribe()
  }, [messageId])

  useEffect(() => {
    if (!isExpanded || !showReadMore) return
    const root = contentRef.current?.closest('[data-component="message-timeline"]') as HTMLElement | null
    const btn = collapseBtnRef.current
    if (!root || !btn) return
    const observer = new IntersectionObserver((entries) => {
      const vis = entries[0]?.isIntersecting ?? false
      setCollapseInlineVisible(vis)
    }, { root, threshold: 0.01 })
    observer.observe(btn)
    return () => observer.disconnect()
  }, [isExpanded, showReadMore])

  const handleToggle = () => {
    setIsExpanded(prev => !prev)
  }

  return (
    <div className={cn('relative group overflow-hidden', className)}>
      <div
        ref={contentRef}
        className={cn('transition-all duration-300 ease-in-out', !isExpanded && showReadMore ? 'overflow-hidden' : '')}
        style={{ maxHeight: !isExpanded && showReadMore ? `${maxHeight}px` : 'none' }}
      >
        {children}
      </div>

      {!isExpanded && showReadMore && (
        <>
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-background/60 to-transparent z-0',
              gradientClassName
            )}
          />
          <button
            type="button"
            onClick={handleToggle}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm text-muted-foreground shadow-none border-0 flex items-center gap-1 active:scale-[0.98]"
          >
            <span>{readMoreLabel}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </>
      )}

      {isExpanded && showReadMore && (
        <button
          type="button"
          ref={collapseBtnRef}
          data-collapse-inline-for={messageId}
          onClick={handleToggle}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm text-muted-foreground shadow-none border-0 flex items-center gap-1 active:scale-[0.98]"
        >
          <ChevronUp className="w-3 h-3" />
          <span>{collapseLabel}</span>
        </button>
      )}
    </div>
  )
}

