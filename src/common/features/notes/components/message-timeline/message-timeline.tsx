import { Button } from "@/common/components/ui/button";
import { FloatingActionButton } from "@/common/components/ui/floating-action-button";
import { ScrollToBottomButton } from "@/common/features/notes/components/scroll-to-bottom-button";
import { useChatScroll } from "@/common/features/notes/hooks/use-chat-scroll";
import { useLazyLoadingScrollControl } from "@/common/features/notes/hooks/use-lazy-loading-scroll-control";
import { READ_MORE_DATA_ATTRS } from "@/common/features/read-more/core/dom-constants";
import { useGlobalCollapse } from "@/common/features/read-more/hooks/use-global-collapse";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { AITrigger, logService } from "@/core/services/log.service";
import { Message } from "@/core/stores/notes-data.store";
import { SideViewEnum, useUIStateStore } from "@/core/stores/ui-state.store";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { Bot, ChevronUp, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { DateDivider } from "./date-divider";
// removed global collapse bus usage

interface MessageTimelineProps {
  renderThoughtRecord?: (message: Message, threadCount: number) => React.ReactNode;
  className?: string;
  groupedMessages: Record<string, Message[]>;
  messages: Message[];
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export interface MessageTimelineRef {
  scrollToBottom: (options?: { behavior?: "smooth" | "instant" }) => void;
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
  const { inputCollapsed, handleExpandInput } = useInputCollapse();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollToBottom, showScrollToBottomButton } = useChatScroll(containerRef, [messages], {
    smoothScroll: true,
  });
  const { recordScrollPosition, restoreScrollPosition } = useLazyLoadingScrollControl({
    containerRef,
  });

  const {
    showFloatingCollapse,
    handleScroll: handleCollapseScroll,
    collapseCurrent,
  } = useGlobalCollapse(containerRef);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      onScroll?.(e);
      recordScrollPosition();
      handleCollapseScroll();
    },
    [onScroll, recordScrollPosition, handleCollapseScroll]
  );

  useHandleRxEvent(presenter.rxEventBus.onHistoryMessagesLoadedEvent$, restoreScrollPosition);
  useHandleRxEvent(presenter.rxEventBus.requestTimelineScrollToBottom$, event => {
    const behavior = event?.behavior || "instant";
    scrollToBottom({ behavior });
  });

  useEffect(() => {
    scrollToBottom({ behavior: "instant" });
  }, [scrollToBottom]);

  // Build a cache of thread counts once per messages change to avoid O(n^2) work on render
  const threadCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of messages ?? []) {
      const key = m.threadId || m.id;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [messages]);

  return (
    <>
      <div
        data-component="message-timeline"
        ref={containerRef}
        className={`w-full bg-background flex-1 overflow-y-auto min-h-0 timeline-scroll ${className}`}
        style={{
          height: "100%",
          minHeight: "100%",
          maxHeight: "100%",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(148, 163, 184, 0.4) transparent",
        }}
        onScroll={handleScroll}
      >
        {Object.entries(groupedMessages).map(([date, dayMessages]) => {
          // Filter only user messages for display (excluding thread messages)
          const userMessages = (dayMessages as Message[]).filter(
            (msg: Message) => msg.sender === "user" && !msg.parentId // Ensure only main messages are shown, not thread messages
          );
          // Use cached thread counts to derive per-message thread size quickly

          return (
            <div key={date} className="w-full" style={{ height: "auto", minHeight: "auto" }}>
              <DateDivider date={date} />

              {/* Elegant timeline of thoughts with subtle separators (like X/Twitter) */}
              {/* Align separators: no extra padding on mobile (edge-to-edge), keep desktop alignment; enhanced visibility in both modes */}
              <div className="px-0 divide-y divide-slate-200/80 dark:divide-slate-800/80">
                {userMessages.map((message: Message) => {
                  const groupKey = message.threadId || message.id;
                  const count = threadCounts.get(groupKey) ?? 0;
                  const threadCount = count > 1 ? count - 1 : 0;

                  return (
                    <div
                      key={message.id}
                      {...{ [READ_MORE_DATA_ATTRS.messageId]: message.id }}
                      className="w-full"
                      style={{ height: "auto", minHeight: "auto" }}
                    >
                      {renderThoughtRecord ? (
                        renderThoughtRecord(message, threadCount)
                      ) : (
                        <div className="p-4">
                          <div className="text-sm text-muted-foreground">
                            Message: {message.content}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Thread count: {threadCount}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <div className="flex flex-col items-end gap-2">
          {inputCollapsed && (
            <div className="pointer-events-auto">
              <FloatingActionButton onClick={handleExpandInput} ariaLabel="Show composer">
                <Send className="h-4 w-4" />
              </FloatingActionButton>
            </div>
          )}
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
            <ScrollToBottomButton
              onClick={() => {
                logService.logScrollToBottom("", messages.length);
                scrollToBottom({ behavior: "smooth" });
              }}
              isVisible={showScrollToBottomButton}
            />
          </div>
        </div>
      </div>
      <div
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-150 ${showFloatingCollapse ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
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
