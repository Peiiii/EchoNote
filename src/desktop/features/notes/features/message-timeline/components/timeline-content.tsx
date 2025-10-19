import { MessageTimelineSkeleton } from "@/common/features/notes/components/message-timeline/message-skeleton";
import {
  MessageTimeline,
  MessageTimelineRef,
} from "@/common/features/notes/components/message-timeline/message-timeline";
import { SpaceEmptyState } from "@/common/features/notes/components/message-timeline/space-empty-state";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { useLazyLoading } from "@/common/features/notes/hooks/use-lazy-loading";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { DesktopWelcomeGuide } from "@/desktop/features/notes/components/welcome-guide/desktop-welcome-guide";
import { ThoughtRecord } from "@/desktop/features/notes/features/message-timeline/components/thought-record";
import { useCallback, useRef } from "react";

interface TimelineContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

interface TimelineContentProps {
  className?: string;
}

const TimelineContentWrapper = ({ children = "", className = "" }: TimelineContentWrapperProps) => {
  return <div className={`flex-1 flex flex-col min-h-0 relative ${className}`}>{children}</div>;
};

export const TimelineContent = ({ className = "" }: TimelineContentProps) => {
  const presenter = useCommonPresenterContext();
  const timelineScrollContainerRef = useRef<MessageTimelineRef>(null);
  const { currentChannelId } = useNotesViewStore();


  useHandleRxEvent(presenter.rxEventBus.requestTimelineScrollToBottom$, () => {
    timelineScrollContainerRef.current?.scrollToBottom({ behavior: "instant" });
  });

  const { messages, loading, hasMore, loadMore, getChannelState } = useChannelMessages({
    onHistoryMessagesChange: messages => {
      presenter.rxEventBus.onHistoryMessagesLoadedEvent$.emit(messages);
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
    return (
      <TimelineContentWrapper>
        <DesktopWelcomeGuide />
      </TimelineContentWrapper>
    );
  }

  if (loading) {
    return (
      <TimelineContentWrapper>
        <MessageTimelineSkeleton count={5} />
      </TimelineContentWrapper>
    );
  }

  if (!hasMessages) {
    return (
      <TimelineContentWrapper>
        <SpaceEmptyState />
      </TimelineContentWrapper>
    );
  }

  return (
    <TimelineContentWrapper className={className}>
      <div className={`flex-1 flex flex-col min-h-0 relative ${className}`}>
        <MessageTimeline
          ref={timelineScrollContainerRef}
          renderThoughtRecord={renderThoughtRecord}
          groupedMessages={groupedMessages}
          messages={messages}
          onScroll={handleScroll}
        />
      </div>
    </TimelineContentWrapper>
  );
};
