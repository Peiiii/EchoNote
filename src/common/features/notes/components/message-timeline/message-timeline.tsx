import { FloatingActionButton } from "@/common/components/ui/floating-action-button";
import { ScrollToBottomButton } from "@/common/features/notes/components/scroll-to-bottom-button";
import { useChatScroll } from "@/common/features/notes/hooks/use-chat-scroll";
import { useLazyLoadingScrollControl } from "@/common/features/notes/hooks/use-lazy-loading-scroll-control";
import { RxEvent } from "@/common/lib/rx-event";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { Bot, ChevronUp } from "lucide-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { Button } from "@/common/components/ui/button";
import { useGlobalCollapse } from "@/common/features/read-more/hooks/use-global-collapse";
import { DateDivider } from "./date-divider";
// removed global collapse bus usage

interface MessageTimelineProps {
  renderThoughtRecord?: (
    message: Message,
    threadCount: number
  ) => React.ReactNode;
  className?: string;
  groupedMessages: Record<string, Message[]>;
  messages: Message[];
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onHistoryMessagesLoadedEvent$?: RxEvent<Message[]>;
}

export interface MessageTimelineRef {
  scrollToBottom: (options?: { behavior?: "smooth" | "instant" }) => void;
}

export const MessageTimeline = forwardRef<
  MessageTimelineRef,
  MessageTimelineProps
>(
  (
    {
      renderThoughtRecord,
      className = "",
      groupedMessages,
      messages,
      onScroll,
      onHistoryMessagesLoadedEvent$,
    },
    ref
  ) => {
    const { currentChannelId } = useNotesViewStore();
    const { isAIAssistantOpen, openAIAssistant } = useUIStateStore();

    const { containerRef, scrollToBottom, canScrollToBottom } = useChatScroll(
      [],
      { smoothScroll: true }
    );
    const { recordScrollPosition, restoreScrollPosition } =
      useLazyLoadingScrollControl({ containerRef });

    const { showCollapse, handleScroll: handleCollapseScroll, collapseCurrent } = useGlobalCollapse(containerRef);

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        onScroll?.(e);
        recordScrollPosition();
        handleCollapseScroll();
      },
      [onScroll, recordScrollPosition, handleCollapseScroll]
    );

    useEffect(() => {
      return onHistoryMessagesLoadedEvent$?.listen(() => {
        restoreScrollPosition();
      });
    }, [onHistoryMessagesLoadedEvent$, restoreScrollPosition]);

    useImperativeHandle(
      ref,
      () => ({
        scrollToBottom: scrollToBottom,
      }),
      [scrollToBottom]
    );

    useEffect(() => {
      scrollToBottom({ behavior: "instant" });
    }, [scrollToBottom]);

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
            msOverflowStyle: "auto",
          }}
          onScroll={handleScroll}
        >
          {Object.entries(groupedMessages).map(([date, dayMessages]) => {
            // Filter only user messages for display (excluding thread messages)
            const userMessages = (dayMessages as Message[]).filter(
              (msg: Message) => msg.sender === "user" && !msg.parentId // Ensure only main messages are shown, not thread messages
            );

            return (
              <div
                key={date}
                className="w-full"
                style={{ height: "auto", minHeight: "auto" }}
              >
                <DateDivider date={date} />

                {/* Elegant timeline of thoughts */}
                {userMessages.map((message: Message) => {
                  const threadMessages = (messages ?? []).filter(
                    (msg) => msg.threadId === (message.threadId || message.id)
                  );
                  const threadCount =
                    threadMessages.length > 1 ? threadMessages.length - 1 : 0;

                  return (
                    <div
                      key={message.id}
                      data-message-id={message.id}
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
            );
          })}
        </div>
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
          <div className="flex flex-col items-end gap-2">
            <div className="pointer-events-auto">
              <FloatingActionButton
                onClick={() => {
                  if (currentChannelId) {
                    openAIAssistant(currentChannelId);
                  }
                }}
                isVisible={!isAIAssistantOpen}
                ariaLabel="Open AI Assistant"
              >
                <Bot className="h-4 w-4" />
              </FloatingActionButton>
            </div>
            <div className="pointer-events-auto">
              <ScrollToBottomButton
                onClick={() => scrollToBottom({ behavior: "smooth" })}
                isVisible={canScrollToBottom}
              />
            </div>
          </div>
        </div>
        <div
          className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-150 ${showCollapse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + var(--collapse-float-offset, 8px))' }}
        >
          {showCollapse && (
            <div className="pointer-events-auto">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 rounded-full px-2.5 shadow-lg flex items-center gap-1"
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
  }
);
