import { ReactNode } from "react";

interface TimelineContainerProps {
    timeline: ReactNode;
    input: ReactNode;
    scrollButton?: ReactNode;
    className?: string;
}

export const TimelineContainer = ({ timeline, input, scrollButton, className = "" }: TimelineContainerProps) => {
    return (
        <div data-component="timeline-container" className={`relative flex-1 flex flex-col h-full ${className}`}>
            {/* Timeline and scroll button */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                {timeline}
                {scrollButton}
            </div>
            {/* Message input */}
            {input}
        </div>
    );
};
