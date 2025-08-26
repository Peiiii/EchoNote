import { RefObject } from "react";
import { MessageTimeline } from "./message-timeline";
import { Message } from "@/core/stores/chat-data.store";

interface MessageTimelineContainerProps {
    containerRef?: RefObject<HTMLDivElement | null>;
    className?: string;
    renderThoughtRecord: (message: Message, threadCount: number) => React.ReactNode;
}

export const MessageTimelineContainer = ({ 
    containerRef, 
    className = "",
    renderThoughtRecord
}: MessageTimelineContainerProps) => {
    return (
        <div 
            ref={containerRef}
            className={`flex-1 overflow-y-auto min-h-0 ${className}`}
        >
            <MessageTimeline 
                renderThoughtRecord={renderThoughtRecord}
            />
        </div>
    );
};
