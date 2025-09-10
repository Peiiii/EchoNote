import { EmptyState } from "@/common/features/notes/components/message-timeline/empty-state";
import { MessageTimelineSkeleton } from "@/common/features/notes/components/message-timeline/message-skeleton";
import { MessageTimeline, MessageTimelineRef } from "@/common/features/notes/components/message-timeline/message-timeline";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useGroupedMessages } from "@/common/features/notes/hooks/use-grouped-messages";
import { useLazyLoading } from "@/common/features/notes/hooks/use-lazy-loading";
import { useRxEvent } from "@/common/hooks/use-rx-event";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { MobileThoughtRecord } from "@/mobile/features/notes/features/message-timeline";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface MobileTimelineContentRef {
    scrollToBottom: (options?: { behavior?: 'smooth' | 'instant' }) => void;
}

interface MobileTimelineContentProps {
    onOpenThread: (messageId: string) => void;
    onReply: (messageId: string) => void;
    className?: string;
}

export const MobileTimelineContent = forwardRef<MobileTimelineContentRef, MobileTimelineContentProps>(({
    onOpenThread,
    onReply,
    className = ""
}, ref) => {
    const { currentChannelId } = useNotesViewStore();
    const messageTimelineRef = useRef<MessageTimelineRef>(null);

    const onHistoryMessagesLoadedEvent$ = useRxEvent<Message[]>();

    const {
        messages = [],
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
        onTrigger: () => {
            if (currentChannelId) {
                loadMore({ channelId: currentChannelId, messagesLimit: 20 });
            }
        },
        canTrigger: !!hasMore && !loading,
        getState: getChannelState,
    });

    const groupedMessages = useGroupedMessages(messages);

    useImperativeHandle(ref, () => ({
        scrollToBottom: (options?: { behavior?: 'smooth' | 'instant' }) => {
            messageTimelineRef.current?.scrollToBottom(options);
        }
    }), [messageTimelineRef]);

    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <MobileThoughtRecord
            message={message}
            onOpenThread={onOpenThread}
            onReply={() => onReply(message.id)}
            threadCount={threadCount}
        />
    );

    const hasMessages = Object.values(groupedMessages).some(dayMessages =>
        (dayMessages as Message[]).some((msg: Message) =>
            msg.sender === "user" &&
            !msg.parentId
        )
    );

    if (loading) {
        return <MessageTimelineSkeleton count={5} />;
    }

    if (!hasMessages) {
        return <EmptyState />;
    }

    return (
        <div className={`flex-1 min-h-0 relative overflow-hidden bg-white dark:bg-slate-950 ${className}`}>
            <MessageTimeline
                ref={messageTimelineRef}
                className="h-full"
                renderThoughtRecord={renderThoughtRecord}
                groupedMessages={groupedMessages}
                messages={messages}
                onScroll={handleScroll}
                onHistoryMessagesLoadedEvent$={onHistoryMessagesLoadedEvent$}
            />
        </div>
    );
});
