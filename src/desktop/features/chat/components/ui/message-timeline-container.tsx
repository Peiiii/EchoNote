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
    console.log("[MessageTimelineContainer] ", {
        messages,
        containerRef,
        onOpenThread,
        className,
    });
    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-y-auto ${className}`}>
            <MessageTimeline onOpenThread={onOpenThread} messages={messages} />
        </div>
    );
};
