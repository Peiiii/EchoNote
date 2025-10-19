import { MessageTimelineSkeleton } from "@/common/features/notes/components/message-timeline/message-skeleton";
import {
  MessageTimeline,
  MessageTimelineRef,
} from "@/common/features/notes/components/message-timeline/message-timeline";
import { SpaceEmptyState } from "@/common/features/notes/components/message-timeline/space-empty-state";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { useLazyLoading } from "@/common/features/notes/hooks/use-lazy-loading";
import { useRxEvent } from "@/common/hooks/use-rx-event";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { ThoughtRecord } from "@/desktop/features/notes/features/message-timeline/components/thought-record";
import { DesktopWelcomeGuide } from "@/desktop/features/notes/components/welcome-guide/desktop-welcome-guide";
import { forwardRef, useCallback, useRef } from "react";
import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";

interface TimelineContentProps {
  className?: string;
}

export const TimelineContent = forwardRef<MessageTimelineRef, TimelineContentProps>(
  ({ className = "" }) => {
    const presenter = useCommonPresenterContext();
    const timelineScrollContainerRef = useRef<MessageTimelineRef>(null);
    const { currentChannelId } = useNotesViewStore();

    const onHistoryMessagesLoadedEvent$ = useRxEvent<Message[]>();

    useHandleRxEvent(presenter.rxEventBus.requestTimelineScrollToBottom$, () => {
      timelineScrollContainerRef.current?.scrollToBottom({ behavior: "instant" });
    });

    const { messages, loading, hasMore, loadMore, getChannelState } = useChannelMessages({
      onHistoryMessagesChange: messages => {
        onHistoryMessagesLoadedEvent$.emit(messages);
      },
    });
    const { handleScroll } = useLazyLoading({
      onTrigger: () =>
        currentChannelId && loadMore({ channelId: currentChannelId, messagesLimit: 20 }),
      canTrigger: !!hasMore && !loading,
      getState: getChannelState,
    });

    const groupedMessages = useGroupedMessages(messages);

    const renderThoughtRecord = useCallback(
      (message: Message, threadCount: number) => (
        <ThoughtRecord message={message} threadCount={threadCount} />
      ),
      []
    );

    const hasMessages = Object.values(groupedMessages).some(dayMessages =>
      (dayMessages as Message[]).some((msg: Message) => msg.sender === "user" && !msg.parentId)
    );

    if (!currentChannelId) {
      return <DesktopWelcomeGuide />;
    }

    if (loading) {
      return <MessageTimelineSkeleton count={5} />;
    }

    if (!hasMessages) {
      return <SpaceEmptyState />;
    }

    return (
      <div className={`flex-1 flex flex-col min-h-0 relative ${className}`}>
        <MessageTimeline
          ref={timelineScrollContainerRef}
          renderThoughtRecord={renderThoughtRecord}
          groupedMessages={groupedMessages}
          messages={messages}
          onScroll={handleScroll}
          onHistoryMessagesLoadedEvent$={onHistoryMessagesLoadedEvent$}
        />
      </div>
    );
  }
);
