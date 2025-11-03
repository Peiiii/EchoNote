import { Button } from "@/common/components/ui/button";
import { FloatingActionButton } from "@/common/components/ui/floating-action-button";
import { ScrollToTopButton } from "@/common/features/notes/components/scroll-to-top-button";
import { READ_MORE_DATA_ATTRS } from "@/common/features/read-more/core/dom-constants";
import { useGlobalCollapse } from "@/common/features/read-more/hooks/use-global-collapse";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { AITrigger, logService } from "@/core/services/log.service";
import type {
  TimelineScrollAlign,
  TimelineScrollBehavior,
  TimelineVirtualScrollApi,
} from "@/common/services/scroll.manager";
import { Message } from "@/core/stores/notes-data.store";
import { SideViewEnum, useUIStateStore } from "@/core/stores/ui-state.store";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { Bot, ChevronUp, Pencil } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { DateDivider } from "./date-divider";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
// removed global collapse bus usage

interface MessageTimelineProps {
  renderThoughtRecord: (message: Message, threadCount: number) => React.ReactNode;
  className?: string;
  groupedMessages: Record<string, Message[]>;
  messages: Message[];
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

interface MessageTimelineItem {
  type: "date-divider" | "message";
  date?: string;
  message?: Message;
}
export const MessageTimeline = ({
  renderThoughtRecord,
  className = "",
  groupedMessages,
  messages,
  onScroll,
}: MessageTimelineProps) => {
  const presenter = useCommonPresenterContext();
  const sideView = useUIStateStore(s => s.sideView);
  const channelId = useNotesViewStore(s => s.currentChannelId);
  const { inputCollapsed, handleExpandInput, handleCollapseInput } = useInputCollapse();
  // Delay showing the bottom FAB until the input collapse animation finishes,
  // to avoid the visual "sliding down" caused by the content area resizing.
  const [showComposerFab, setShowComposerFab] = useState(false);
  useEffect(() => {
    // Match the composer panel transition (~220ms) with a small buffer
    const DELAY_MS = 260;
    let timer: number | null = null;
    if (inputCollapsed) {
      timer = window.setTimeout(() => setShowComposerFab(true), DELAY_MS);
    } else {
      setShowComposerFab(false);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [inputCollapsed]);
  // We render the timeline with react-virtuoso for virtualization.
  // containerRef points to the scrollable container (the Virtuoso Scroller)
  const containerRef = useRef<HTMLDivElement>(null);
  presenter.scrollManager.setScrollContainerRef(containerRef);
  const virtuosoRef = useRef<VirtuosoHandle | null>(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const threshold = 30;
  const scrollToTop = useCallback((options?: { behavior?: "smooth" | "instant" }) => {
    // Virtuoso exposes an imperative scrollTo API; fall back to DOM if needed
    const behavior = options?.behavior === "smooth" ? "smooth" : "auto";
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollTo({ top: 0, behavior });
      return;
    }
    const el = containerRef.current;
    el?.scrollTo({ top: 0, behavior });
  }, []);

  const {
    showFloatingCollapse,
    handleScroll: handleCollapseScroll,
    collapseCurrent,
  } = useGlobalCollapse(containerRef);

  // Auto-collapse/expand composer based on scroll position.
  // The previous single-threshold approach (collapse when >40px, expand otherwise)
  // caused oscillation when the content height was close to the viewport height,
  // because collapsing the composer changes the viewport height, which in turn
  // flips the condition back and forth during the transition.
  // Use hysteresis (two thresholds) + a short lock to avoid rapid toggling.
  const lastAutoRef = useRef<"top" | "away" | null>(null);
  const COLLAPSE_THRESHOLD = 100; // collapse when scrolled down more than this many px
  const EXPAND_THRESHOLD = 8; // expand only when scrolled back to the very top
  const TRANSITION_LOCK_MS = 320; // ignore toggles while the composer animates
  const lockUntilRef = useRef<number>(0);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      onScroll?.(e);
      handleCollapseScroll();
      const el = containerRef.current;
      if (el) {
        setShowScrollToTopButton(el.scrollTop > threshold);
        // Auto collapse/expand composer with hysteresis and a short transition lock
        const now = Date.now();
        if (now < lockUntilRef.current) return; // composer is mid-transition

        // Collapse when well away from the top; expand only when nearly at the top
        if (el.scrollTop > COLLAPSE_THRESHOLD) {
          if (lastAutoRef.current !== "away") {
            handleCollapseInput();
            lastAutoRef.current = "away";
            lockUntilRef.current = now + TRANSITION_LOCK_MS;
          }
        } else if (el.scrollTop <= EXPAND_THRESHOLD) {
          if (lastAutoRef.current !== "top") {
            handleExpandInput();
            lastAutoRef.current = "top";
            lockUntilRef.current = now + TRANSITION_LOCK_MS;
          }
        }
      }
    },
    [onScroll, handleCollapseScroll, handleCollapseInput, handleExpandInput]
  );

  // Keep our lastAutoRef in sync with the actual composer state
  useEffect(() => {
    lastAutoRef.current = inputCollapsed ? "away" : "top";
  }, [inputCollapsed]);

  // Bind scroll listener to the Virtuoso scroller element (simplest usage)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScrollHandler = (ev: Event) => {
      handleScroll(ev as unknown as React.UIEvent<HTMLDivElement>);
    };
    el.addEventListener("scroll", onScrollHandler, { passive: true });
    return () => el.removeEventListener("scroll", onScrollHandler);
  }, [handleScroll]);

  // Listen to new event (alias keeps old name working)
  useHandleRxEvent(presenter.rxEventBus.requestTimelineScrollToLatest$, event => {
    const behavior = event?.behavior || "instant";
    scrollToTop({ behavior });
  });

  useEffect(() => {
    // Show newest at the top by default
    scrollToTop({ behavior: "instant" });
  }, [scrollToTop]);

  useEffect(() => {
    handleExpandInput();
  }, [channelId]);

  // Build a cache of thread counts once per messages change to avoid O(n^2) work on render
  const threadCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of messages ?? []) {
      const key = m.threadId || m.id;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [messages]);

  const { items, indexMap } = useMemo(() => {
    const list: MessageTimelineItem[] = [];
    const map = new Map<string, number>();
    Object.entries(groupedMessages).forEach(([date, dayMessages]) => {
      list.push({
        type: "date-divider",
        date,
      });
      dayMessages
        .filter(msg => msg.sender === "user" && !msg.parentId)
        .forEach((message: Message) => {
          list.push({
            type: "message",
            message,
          });
          map.set(message.id, list.length - 1);
        });
    });
    return { items: list, indexMap: map };
  }, [groupedMessages]);

  const indexMapRef = useRef(indexMap);
  indexMapRef.current = indexMap;

  useEffect(() => {
    const api: TimelineVirtualScrollApi = {
      scrollToMessageId: (
        messageId: string,
        options?: { align?: TimelineScrollAlign; behavior?: TimelineScrollBehavior }
      ) => {
        const index = indexMapRef.current.get(messageId);
        const virtuoso = virtuosoRef.current;
        if (index === undefined || !virtuoso) {
          return false;
        }
        virtuoso.scrollToIndex({
          index,
          align: options?.align ?? "start",
          behavior: options?.behavior ?? "auto",
        });
        return true;
      },
    };
    presenter.scrollManager.setTimelineVirtualScrollApi(api);
    return () => {
      presenter.scrollManager.setTimelineVirtualScrollApi(null);
    };
  }, [presenter]);

  const renderMessageItem = (message: Message) => {
    const groupKey = message.threadId || message.id;
    const count = threadCounts.get(groupKey) ?? 0;
    const threadCount = count > 1 ? count - 1 : 0;
    return (
      // <div className="px-0 divide-y border-t border-slate-200/80 dark:border-slate-800/80">
      <div
        key={message.id}
        {...{ [READ_MORE_DATA_ATTRS.messageId]: message.id }}
        className="w-full"
        style={{ height: "auto", minHeight: "auto" }}
      >
        {renderThoughtRecord(message, threadCount)}
      </div>
      // </div>
    );
  };

  const renderDateDivider = (date: string) => {
    return (
      <div key={date} className="w-full" style={{ height: "auto", minHeight: "auto" }}>
        <DateDivider date={date} />
      </div>
    );
  };

  const renderItem = (item: MessageTimelineItem) => {
    if (item.type === "date-divider") {
      return renderDateDivider(item.date as string);
    }
    return renderMessageItem(item.message as Message);
  };

  return (
    <>
      {/**
       * 最简单用法：直接使用 Virtuoso，scrollerRef 获取滚动容器，
       * 我们在 useEffect 里绑定 scroll 事件给 existing 逻辑（懒加载、折叠）。
       */}
      <div
        className={`w-full bg-background flex-1 overflow-hidden min-h-0 ${className}`}
        style={{ height: "100%", minHeight: "100%", maxHeight: "100%" }}
      >
        <Virtuoso
          ref={instance => {
            virtuosoRef.current = instance;
          }}
          data={items}
          itemContent={(_, item) => renderItem(item)}
          scrollerRef={ref => {
            containerRef.current = (ref as HTMLDivElement) || null;
            if (ref instanceof HTMLDivElement) {
              ref.classList.add("timeline-scroll");
            }
          }}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
      <div className="absolute top-8 right-4 z-20 pointer-events-none">
        <div className="flex flex-col items-end gap-2">
          <div className="pointer-events-auto">
            <FloatingActionButton
              onClick={() => {
                logService.logAIAssistantOpen("", AITrigger.BUTTON);
                presenter.openAIAssistant();
              }}
              isVisible={sideView !== SideViewEnum.AI_ASSISTANT}
              ariaLabel="Open AI Assistant"
            >
              <Bot className="h-4 w-4" />
            </FloatingActionButton>
          </div>
          <div className="pointer-events-auto">
            <ScrollToTopButton
              onClick={() => {
                logService.logScrollToLatest("", messages.length);
                scrollToTop({ behavior: "smooth" });
              }}
              isVisible={showScrollToTopButton}
            />
          </div>
        </div>
      </div>
      {/** Bottom-right floating area: reveal after collapse settles (no sliding) */}
      <div
        className="absolute right-4 z-20 pointer-events-none"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <div
          className={`transition-opacity duration-150 ${showComposerFab ? "opacity-100" : "opacity-0"}`}
        >
          {showComposerFab && (
            <div className="pointer-events-auto">
              <FloatingActionButton onClick={handleExpandInput} ariaLabel="Show composer">
                <Pencil className="h-4 w-4" />
              </FloatingActionButton>
            </div>
          )}
        </div>
      </div>
      <div
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-150 ${showFloatingCollapse ? "opacity-100 -translate-y-1" : "opacity-0 translate-y-0"}`}
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + var(--collapse-float-offset, 8px))",
        }}
      >
        {showFloatingCollapse && (
          <div className="pointer-events-auto">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 rounded-full px-2.5 shadow-lg flex items-center gap-1 hover:bg-secondary"
              onClick={collapseCurrent}
              aria-label="Collapse current"
            >
              <ChevronUp className="h-4 w-4" />
              <span className="text-xs leading-none">Collapse</span>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
