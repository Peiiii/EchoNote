import { MessageTimelineSkeleton } from "@/common/features/notes/components/message-timeline/message-skeleton";
import {
  MessageTimeline
} from "@/common/features/notes/components/message-timeline/message-timeline";
import { SpaceEmptyState } from "@/common/features/notes/components/message-timeline/space-empty-state";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { useLazyLoading } from "@/common/features/notes/hooks/use-lazy-loading";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { MobileWelcomeGuide } from "@/mobile/features/notes/components/welcome-guide/mobile-welcome-guide";
import { MobileThoughtRecord } from "@/mobile/features/notes/features/message-timeline/components/thought-record/index";

export interface MobileTimelineContentRef {
  scrollToBottom: (options?: { behavior?: "smooth" | "instant" }) => void;
}

interface MobileTimelineContentProps {
  onReply: (messageId: string) => void;
  className?: string;
}

export const MobileTimelineContent = ({ onReply, className = "" }: MobileTimelineContentProps) => {
  const presenter = useCommonPresenterContext();
  const { currentChannelId } = useNotesViewStore();
  const channels = useNotesDataStore(s => s.channels);
  const channelsLoading = useNotesDataStore(s => s.channelsLoading);
  const {
    messages = [],
    loading,
    hasMore,
    loadMore,
    getChannelState,
  } = useChannelMessages({
    onHistoryMessagesChange: messages => {
      presenter.rxEventBus.onHistoryMessagesLoadedEvent$.emit(messages);
    },
  });
  // Latest messages first for top-down reading
  const groupedMessages = useGroupedMessages(messages, { latestFirst: true });

  const { handleScroll } = useLazyLoading({
    onTrigger: () => {
      if (currentChannelId) {
        loadMore({ channelId: currentChannelId, messagesLimit: 20 });
      }
    },
    canTrigger: !!hasMore && !loading,
    getState: getChannelState,
    direction: 'bottom',
  });

  const hasMessages = Object.values(groupedMessages).some(dayMessages =>
    (dayMessages as Message[]).some((msg: Message) => msg.sender === "user" && !msg.parentId)
  );

  if (!currentChannelId) {
    // Avoid a transient welcome state while channels are still loading or awaiting auto-selection.
    // Only show the welcome guide when we are confident the user truly has zero spaces.
    if (channelsLoading || channels.length > 0) {
      return <MessageTimelineSkeleton count={5} />;
    }
    return <MobileWelcomeGuide />;
  }

  if (loading) {
    return <MessageTimelineSkeleton count={5} />;
  }

  if (!hasMessages) {
    return <SpaceEmptyState />;
  }

  return (
    <div
      className={`flex-1 min-h-0 relative overflow-hidden bg-white dark:bg-slate-950 ${className}`}
    >
      <MessageTimeline
        className="h-full"
        renderThoughtRecord={(message: Message, threadCount: number) => (
          <MobileThoughtRecord
            message={message}
            onReply={() => onReply(message.id)}
            threadCount={threadCount}
          />
        )}
        groupedMessages={groupedMessages}
        messages={messages}
        onScroll={handleScroll}
      />
    </div>
  );
};
