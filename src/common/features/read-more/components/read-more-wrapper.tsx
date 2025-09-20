import { cn } from "@/common/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getFloatOffset } from "../core/collapse-utils";
import {
  selectShowFloatingCollapse,
  useReadMoreStore,
} from "../store/read-more.store";

interface ReadMoreBaseWrapperProps {
  children: React.ReactNode;
  messageId: string;
  maxHeight: number;
  clampMargin?: number;
  className?: string;
  gradientClassName?: string;
  readMoreLabel?: string;
  collapseLabel?: string;
}

export function ReadMoreBaseWrapper({
  children,
  messageId,
  maxHeight,
  clampMargin = 0,
  className,
  gradientClassName,
  readMoreLabel = "Read more",
  collapseLabel = "Collapse",
}: ReadMoreBaseWrapperProps) {
  const setStatus = useReadMoreStore(
    useCallback((state) => state.setStatus, [])
  );
  const pendingCollapseId = useReadMoreStore(
    (state) => state.pendingCollapseId
  );
  const acknowledgeCollapse = useReadMoreStore(
    useCallback((state) => state.acknowledgeCollapse, [])
  );

  const showFloatingCollapse = useReadMoreStore(selectShowFloatingCollapse);
  const focusedId = useReadMoreStore(
    useCallback((state) => state.focusedId, [])
  );
  const inlineOverlap = useReadMoreStore(
    useCallback((state) => state.inlineOverlap, [])
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [collapseInlineVisible, setCollapseInlineVisible] = useState<
    boolean | undefined
  >(undefined);

  const contentRef = useRef<HTMLDivElement>(null);
  const collapseBtnRef = useRef<HTMLButtonElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const contentHeight = contentRef.current.scrollHeight;
    setShowReadMore(contentHeight > maxHeight + clampMargin);
  }, [children, maxHeight, clampMargin, isExpanded]);

  useEffect(() => {
    setStatus(messageId, {
      long: showReadMore,
      expanded: isExpanded,
      inlineVisible:
        collapseInlineVisible === undefined ? undefined : collapseInlineVisible,
    });
  }, [messageId, showReadMore, isExpanded, collapseInlineVisible, setStatus]);

  useEffect(() => {
    if (pendingCollapseId === messageId && isExpanded) {
      setIsExpanded(false);
      acknowledgeCollapse();
    }
  }, [pendingCollapseId, messageId, isExpanded, acknowledgeCollapse]);

  useEffect(() => {
    if (!isExpanded || !showReadMore) {
      setCollapseInlineVisible(undefined);
    }
  }, [isExpanded, showReadMore]);

  useEffect(() => {
    observerRef.current?.disconnect();

    if (!isExpanded || !showReadMore) return;
    const root = contentRef.current?.closest(
      '[data-component="message-timeline"]'
    ) as HTMLElement | null;
    const btn = collapseBtnRef.current;
    if (!root || !btn) return;

    const offset = getFloatOffset(root);
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries[0]?.isIntersecting ?? false;
        setCollapseInlineVisible(vis);
      },
      { root, threshold: 0.01, rootMargin: `0px 0px ${-offset}px 0px` }
    );
    observer.observe(btn);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [isExpanded, showReadMore]);

  const handleToggle = () => setIsExpanded((prev) => !prev);
  const inlineHidden =
    showFloatingCollapse && inlineOverlap && messageId === focusedId;

  return (
    <div className={cn("relative group overflow-hidden", className)}>
      <div
        ref={contentRef}
        className={cn(
          "transition-all duration-300 ease-in-out",
          !isExpanded && showReadMore ? "overflow-hidden" : ""
        )}
        style={{
          maxHeight: !isExpanded && showReadMore ? `${maxHeight}px` : "none",
        }}
      >
        {children}
      </div>

      {!isExpanded && showReadMore && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-background/60 to-transparent z-0",
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
          className={cn(
            "absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm text-muted-foreground shadow-none border-0 flex items-center gap-1 active:scale-[0.98] transition-opacity duration-150",
            inlineHidden && "opacity-0 pointer-events-none"
          )}
        >
          <ChevronUp className="w-3 h-3" />
          <span>{collapseLabel}</span>
        </button>
      )}
    </div>
  );
}
