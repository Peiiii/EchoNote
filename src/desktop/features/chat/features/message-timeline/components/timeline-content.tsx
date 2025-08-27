import { MessageTimelineSkeleton } from "@/common/features/chat/components/message-timeline/message-skeleton";
import { MessageTimeline, MessageTimelineRef } from "@/common/features/chat/components/message-timeline/message-timeline";
import { useChannelMessages } from "@/common/features/chat/hooks/use-channel-messages";
import { useGroupedMessages } from "@/common/features/chat/hooks/use-grouped-messages";
import { useLazyLoading } from "@/common/features/chat/hooks/use-lazy-loading";
import { useRxEvent } from "@/common/hooks/use-rx-event";
import { Message } from "@/core/stores/chat-data.store";
import { forwardRef } from "react";

interface TimelineContentProps {
    renderThoughtRecord: (message: Message, threadCount: number) => React.ReactNode;
    className?: string;
}

export const TimelineContent = forwardRef<MessageTimelineRef, TimelineContentProps>(({
    renderThoughtRecord,
    className = ""
}, ref) => {

    const onHistoryMessagesLoadedEvent$ = useRxEvent<Message[]>();

    const {
        messages,
        loading,
        hasMore,
        loadMore,
        hasMoreRef,
        loadingRef,
        loadingMoreRef,
    } = useChannelMessages({
        messagesLimit: 20,
        onHistoryMessagesChange: (messages) => {
            onHistoryMessagesLoadedEvent$.fire(messages);
        }
    });

    const { handleScroll } = useLazyLoading({
        onTrigger: loadMore,
        canTrigger: hasMore && !loading,
        hasMoreRef,
        loadingRef,
        loadingMoreRef
    });

    const groupedMessages = useGroupedMessages(messages);


    if (loading) {
        return <MessageTimelineSkeleton count={5} />;
    }

    return (
        <div className={`flex-1 flex flex-col min-h-0 relative ${className}`}>
            <MessageTimeline
                ref={ref}
                renderThoughtRecord={renderThoughtRecord}
                groupedMessages={groupedMessages}
                messages={messages}
                onScroll={handleScroll}
                onHistoryMessagesLoadedEvent$={onHistoryMessagesLoadedEvent$}
            />
        </div>
    );
});
