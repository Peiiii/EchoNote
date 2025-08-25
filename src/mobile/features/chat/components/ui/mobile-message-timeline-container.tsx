import { Message } from "@/core/stores/chat-data.store";
import { MessageTimeline } from "@/common/features/chat/components/message-timeline/message-timeline";
import { MobileThoughtRecord } from "../message-timeline/thought-record";

interface MobileMessageTimelineContainerProps {
    onOpenThread: (messageId: string) => void;
    messages: Message[];
    onReply?: (messageId: string) => void;
}

export const MobileMessageTimelineContainer = ({
    onOpenThread,
    messages,
    onReply
}: MobileMessageTimelineContainerProps) => {
    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <MobileThoughtRecord
            message={message}
            onOpenThread={onOpenThread}
            onReply={onReply ? () => onReply(message.id) : undefined}
            threadCount={threadCount}
        />
    );

    return (
        <MessageTimeline 
            messages={messages} 
            renderThoughtRecord={renderThoughtRecord}
        />
    );
};
