import { MessageTimelineSkeleton } from "@/common/features/chat/components/message-timeline/message-skeleton";
import { MessageTimeline, MessageTimelineRef } from "@/common/features/chat/components/message-timeline/message-timeline";
import { useGroupedMessages } from "@/common/features/chat/hooks/use-grouped-messages";
import { usePaginatedMessages } from "@/common/features/chat/hooks/use-paginated-messages";
import { Message } from "@/core/stores/chat-data.store";
import { useRef } from "react";

interface TimelineContentProps {
    renderThoughtRecord: (message: Message, threadCount: number) => React.ReactNode;
    className?: string;
}

export const TimelineContent = ({
    renderThoughtRecord,
    className = ""
}: TimelineContentProps) => {
    const messageTimelineRef = useRef<MessageTimelineRef>(null);

    const { messages, loading } = usePaginatedMessages(20);

    const groupedMessages = useGroupedMessages(messages);

    if (loading) {
        return <MessageTimelineSkeleton count={5} />;
    }

    return (
        <div className={`flex-1 flex flex-col min-h-0 relative ${className}`}>
            <MessageTimeline
                ref={messageTimelineRef}
                renderThoughtRecord={renderThoughtRecord}
                groupedMessages={groupedMessages}
                messages={messages}
            />
        </div>
    );
};
