import { RefObject } from "react";
import { MessageTimeline } from "../message-timeline";
import { Message } from "@/core/stores/chat-data.store";

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
    return (
        <div 
            ref={containerRef}
            className={`flex-1 overflow-y-auto min-h-0 ${className}`}
        >
            <MessageTimeline onOpenThread={onOpenThread} messages={messages} />
        </div>
    );
};
