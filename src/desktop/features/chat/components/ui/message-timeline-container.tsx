import { RefObject } from "react";
import { MessageTimeline } from "../message-timeline";

interface MessageTimelineContainerProps {
    containerRef: RefObject<HTMLDivElement | null>;
    className?: string;
}

export const MessageTimelineContainer = ({ containerRef, className = "" }: MessageTimelineContainerProps) => {
    return (
        <div ref={containerRef} className={`absolute inset-0 overflow-y-auto ${className}`}>
            <MessageTimeline />
        </div>
    );
};
