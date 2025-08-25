import { RefObject } from "react";
import { Message } from "@/core/stores/chat-data.store";
import { MessageTimelineContainer as CommonMessageTimelineContainer } from "@/common/features/chat/components/message-timeline/message-timeline-container";
import { MobileThoughtRecord } from "../message-timeline/thought-record";

interface MobileMessageTimelineContainerProps {
    containerRef: RefObject<HTMLDivElement | null>;
    onOpenThread: (messageId: string) => void;
    messages: Message[];
    className?: string;
    onReply?: (messageId: string) => void;
}

export const MobileMessageTimelineContainer = ({
    containerRef,
    onOpenThread,
    messages,
    className = "",
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
        <CommonMessageTimelineContainer
            containerRef={containerRef}
            messages={messages}
            className={className}
            renderThoughtRecord={renderThoughtRecord}
        />
    );
};
