import { Message } from "@/core/stores/chat-data.store";
import { MessageTimeline as CommonMessageTimeline } from "@/common/features/chat/components/message-timeline/message-timeline";
import { ThoughtRecord } from "./thought-record";

interface MessageTimelineProps {
    onOpenThread: (messageId: string) => void;
}

export function MessageTimeline({ onOpenThread }: MessageTimelineProps) {
    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <ThoughtRecord 
            message={message} 
            onOpenThread={onOpenThread}
            threadCount={threadCount}
        />
    );

    return (
        <CommonMessageTimeline
            renderThoughtRecord={renderThoughtRecord}
        />
    );
}