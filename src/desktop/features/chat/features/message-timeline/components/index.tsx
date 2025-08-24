import { Message } from "@/core/stores/chat-data.store";
import { MessageTimeline as CommonMessageTimeline } from "@/common/features/chat/components/message-timeline/message-timeline";
import { ThoughtRecord } from "./thought-record";

interface MessageTimelineProps {
    onOpenThread: (messageId: string) => void;
    messages?: Message[];
}

export function MessageTimeline({ onOpenThread, messages }: MessageTimelineProps) {
    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <ThoughtRecord 
            message={message} 
            onOpenThread={onOpenThread}
            threadCount={threadCount}
        />
    );

    return (
        <CommonMessageTimeline
            messages={messages}
            renderThoughtRecord={renderThoughtRecord}
        />
    );
}