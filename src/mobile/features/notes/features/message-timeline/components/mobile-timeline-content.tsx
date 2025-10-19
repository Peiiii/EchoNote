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
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { MobileWelcomeGuide } from "@/mobile/features/notes/components/welcome-guide/mobile-welcome-guide";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { MobileThoughtRecord } from "./thought-record";

export interface MobileTimelineContentRef {
  scrollToBottom: (options?: { behavior?: "smooth" | "instant" }) => void;
}

interface MobileTimelineContentProps {
  onReply: (messageId: string) => void;
  className?: string;
}

export const MobileTimelineContent = forwardRef<
  MobileTimelineContentRef,
  MobileTimelineContentProps
>(({ onReply, className = "" }, ref) => {
  const presenter = useCommonPresenterContext();
  const { currentChannelId } = useNotesViewStore();
  const messageTimelineRef = useRef<MessageTimelineRef>(null);
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
  const groupedMessages = useGroupedMessages(messages);

  const { handleScroll } = useLazyLoading({
    onTrigger: () => {
      if (currentChannelId) {
        loadMore({ channelId: currentChannelId, messagesLimit: 20 });
      }
    },
    canTrigger: !!hasMore && !loading,
    getState: getChannelState,
  });


  useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: (options?: { behavior?: "smooth" | "instant" }) => {
        messageTimelineRef.current?.scrollToBottom(options);
      },
    }),
    [messageTimelineRef]
  );

  const renderThoughtRecord = (message: Message, threadCount: number) => (
    <MobileThoughtRecord
      message={message}
      onReply={() => onReply(message.id)}
      threadCount={threadCount}
    />
  );

  const hasMessages = Object.values(groupedMessages).some(dayMessages =>
    (dayMessages as Message[]).some((msg: Message) => msg.sender === "user" && !msg.parentId)
  );

  if (!currentChannelId) {
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
        ref={messageTimelineRef}
        className="h-full"
        renderThoughtRecord={renderThoughtRecord}
        groupedMessages={groupedMessages}
        messages={messages}
        onScroll={handleScroll}
      />
    </div>
  );
});
