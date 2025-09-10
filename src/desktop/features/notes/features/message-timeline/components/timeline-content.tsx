import { MessageTimelineSkeleton } from "@/common/features/notes/components/message-timeline/message-skeleton";
import { MessageTimeline, MessageTimelineRef } from "@/common/features/notes/components/message-timeline/message-timeline";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { useLazyLoading } from "@/common/features/notes/hooks/use-lazy-loading";
import { useRxEvent } from "@/common/hooks/use-rx-event";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { forwardRef } from "react";

interface TimelineContentProps {
    renderThoughtRecord: (message: Message, threadCount: number) => React.ReactNode;
    className?: string;
}

export const TimelineContent = forwardRef<MessageTimelineRef, TimelineContentProps>(({
    renderThoughtRecord,
    className = ""
}, ref) => {

    const { currentChannelId } = useNotesViewStore();

    const onHistoryMessagesLoadedEvent$ = useRxEvent<Message[]>();

    const {
        messages,
        loading,
        hasMore,
        loadMore,
        getChannelState,
    } = useChannelMessages({
        onHistoryMessagesChange: (messages) => {
            onHistoryMessagesLoadedEvent$.emit(messages);
        }
    });

    const { handleScroll } = useLazyLoading({
        onTrigger: () => currentChannelId && loadMore({ channelId: currentChannelId, messagesLimit: 20 }),
        canTrigger: !!hasMore && !loading,
        getState: getChannelState,
    });

    const groupedMessages = useGroupedMessages(messages);


    if (loading) {
        return <MessageTimelineSkeleton count={5} />;
    }

    return (
        <div className={`flex-1 flex flex-col min-h-0 relative ${className}`}>
          {messages && <MessageTimeline
                ref={ref}
                renderThoughtRecord={renderThoughtRecord}
                groupedMessages={groupedMessages}
                messages={messages}
                onScroll={handleScroll}
                onHistoryMessagesLoadedEvent$={onHistoryMessagesLoadedEvent$}
            />}
        </div>
    );
});
