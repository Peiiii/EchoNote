import { RefObject } from "react";
import { Message } from "@/core/stores/chat-data.store";
import { MessageTimelineContainer as CommonMessageTimelineContainer } from "@/common/features/chat/components/message-timeline/message-timeline-container";
import { MobileThoughtRecord } from "../message-timeline/thought-record";

interface MobileMessageTimelineContainerProps {
    containerRef: RefObject<HTMLDivElement | null>;
    onOpenThread: (messageId: string) => void;
    messages: Message[];
    className?: string;
}

export const MobileMessageTimelineContainer = ({
    containerRef,
    onOpenThread,
    messages,
    className = ""
}: MobileMessageTimelineContainerProps) => {
    const renderThoughtRecord = (message: Message, _threadCount: number) => (
        <MobileThoughtRecord
            message={message}
            onOpenThread={onOpenThread}
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
