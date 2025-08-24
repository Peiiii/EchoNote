import { RefObject } from "react";
import { MessageTimelineContainer as CommonMessageTimelineContainer } from "@/common/features/chat/components/message-timeline/message-timeline-container";
import { Message } from "@/core/stores/chat-data.store";
import { ThoughtRecord } from "../message-timeline/thought-record";

interface MessageTimelineContainerProps {
    containerRef: RefObject<HTMLDivElement | null>;
    onOpenThread: (messageId: string) => void;
    messages?: Message[];
    className?: string;
}

export const MessageTimelineContainer = ({ 
    containerRef, 
    onOpenThread, 
    messages,
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
            messages={messages}
            className={className}
            renderThoughtRecord={renderThoughtRecord}
        />
    );
};
