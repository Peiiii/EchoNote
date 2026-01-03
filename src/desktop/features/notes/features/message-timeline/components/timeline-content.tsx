import { MessageTimelineSkeleton } from "@/common/features/notes/components/message-timeline/message-skeleton";
import { MessageTimeline } from "@/common/features/notes/components/message-timeline/message-timeline";
import { SpaceEmptyState } from "@/common/features/notes/components/message-timeline/space-empty-state";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { useLazyLoading } from "@/common/features/notes/hooks/use-lazy-loading";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { DesktopWelcomeGuide } from "@/desktop/features/notes/components/welcome-guide/desktop-welcome-guide";
import { ThoughtRecord } from "@/desktop/features/notes/features/message-timeline/components/thought-record";

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
  const { currentChannelId } = useNotesViewStore();
  const channels = useNotesDataStore(s => s.channels);
  const channelsLoading = useNotesDataStore(s => s.channelsLoading);

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
    // With latest-first ordering, we load older messages when the user nears the bottom
    direction: 'bottom',
  });

  // Use latest-first ordering for a top-down reading experience
  const groupedMessages = useGroupedMessages(messages, { latestFirst: true });

  const hasMessages = Object.values(groupedMessages).some(dayMessages =>
    (dayMessages as Message[]).some((msg: Message) => msg.sender === "user" && !msg.parentId)
  );

  // If a channel is selected but its metadata hasn't arrived yet, treat as loading.
  // This prevents a transient "space empty" state where header/input disappear.
  const hasSelectedChannel = !!currentChannelId;
  const channelReady =
    !hasSelectedChannel || channels.some(c => c.id === currentChannelId);

  if (!currentChannelId) {
    return (
      <TimelineContentWrapper>
        {channelsLoading || channels.length > 0 ? (
          <MessageTimelineSkeleton count={5} />
        ) : (
          <DesktopWelcomeGuide />
        )}
      </TimelineContentWrapper>
    );
  }

  if (!channelReady || channelsLoading) {
    return (
      <TimelineContentWrapper>
        <MessageTimelineSkeleton count={5} />
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
          renderThoughtRecord={(message: Message, threadCount: number) => (
            <ThoughtRecord message={message} threadCount={threadCount} />
          )}
          groupedMessages={groupedMessages}
          messages={messages}
          onScroll={handleScroll}
        />
      </div>
    </TimelineContentWrapper>
  );
};
