import { ReactNode } from "react";

interface TimelineLayoutProps {
    content?: ReactNode;
    actions?: ReactNode;
    className?: string;
}

export const TimelineLayout = ({ 
    content, 
    actions, 
    className = "" 
}: TimelineLayoutProps) => {
    return (
        <div data-component="timeline-container" className={`relative flex-1 flex flex-col h-full ${className}`}>
            {/* Timeline content area */}
            {content}
            
            {/* Actions area */}
            {actions}
        </div>
    );
};
