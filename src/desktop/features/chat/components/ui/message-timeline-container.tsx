import { RefObject } from "react";
import { MessageTimeline } from "../message-timeline";

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
    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-y-auto ${className}`}>
            <MessageTimeline onOpenThread={onOpenThread} />
        </div>
    );
};
