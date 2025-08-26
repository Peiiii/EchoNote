import { RefObject } from "react";
import { MessageTimelineContainer as CommonMessageTimelineContainer } from "@/common/features/chat/components/message-timeline/message-timeline-container";
import { Message } from "@/core/stores/chat-data.store";
import { ThoughtRecord } from "@/desktop/features/chat/features/message-timeline/components/thought-record";

interface MessageTimelineContainerProps {
    containerRef: RefObject<HTMLDivElement | null>;
    onOpenThread: (messageId: string) => void;
    className?: string;
}

export const MessageTimelineContainer = ({ 
    containerRef, 
    onOpenThread, 
    className = "" 
}: MessageTimelineContainerProps) => {
    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <ThoughtRecord 
            message={message} 
            onOpenThread={onOpenThread}
            threadCount={threadCount}
        />
    );

    return (
        <CommonMessageTimelineContainer
            containerRef={containerRef}
            className={className}
            renderThoughtRecord={renderThoughtRecord}
        />
    );
};
