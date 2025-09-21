import { cn } from "@/common/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  selectShowFloatingCollapse,
  useReadMoreStore,
} from "../store/read-more.store";
import { READ_MORE_DATA_ATTRS } from "../core/dom-constants";

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

  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const showFloatingCollapse = useReadMoreStore(selectShowFloatingCollapse);
  const activeMessageId = useReadMoreStore(
    useCallback((state) => state.activeMessageId, [])
  );
  const notifyLayoutChange = useReadMoreStore(
    useCallback((state) => state.notifyLayoutChange, [])
  );
  const suppressAutoScrollOnce = useReadMoreStore(
    useCallback((state) => state.suppressAutoScrollOnce, [])
  );
  const previousExpandedRef = useRef(false);

  useEffect(() => {
    if (!contentRef.current) return;
    const contentHeight = contentRef.current.scrollHeight;
    setShowReadMore(contentHeight > maxHeight + clampMargin);
  }, [children, maxHeight, clampMargin, isExpanded]);

  useEffect(() => {
    setStatus(messageId, {
      long: showReadMore,
      expanded: isExpanded,
      collapseThreshold: maxHeight + clampMargin,
    });
  }, [messageId, showReadMore, isExpanded, maxHeight, clampMargin, setStatus]);

  useEffect(() => {
    if (pendingCollapseId === messageId && isExpanded) {
      setIsExpanded(false);
      acknowledgeCollapse();
    }
  }, [pendingCollapseId, messageId, isExpanded, acknowledgeCollapse]);

  useEffect(() => {
    notifyLayoutChange();
  }, [notifyLayoutChange, isExpanded, showReadMore]);

  useEffect(() => {
    if (isExpanded && !previousExpandedRef.current) {
      suppressAutoScrollOnce();
    }
    previousExpandedRef.current = isExpanded;
  }, [isExpanded, suppressAutoScrollOnce]);

  const handleToggle = () => setIsExpanded((prev) => !prev);
  const inlineHidden =
    showFloatingCollapse && activeMessageId === messageId && isExpanded;
  const collapseInlineData = {
    [READ_MORE_DATA_ATTRS.collapseInlineFor]: messageId,
  } as const;

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
          {...collapseInlineData}
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
