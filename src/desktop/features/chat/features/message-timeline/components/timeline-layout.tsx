import { ReactNode } from "react";
import { Channel } from "@/core/stores/chat-data.store";
import { ChannelCoverHeader } from "./channel-cover-header";

interface TimelineLayoutProps {
    content?: ReactNode;
    actions?: ReactNode;
    channel?: Channel;
    onOpenSettings?: () => void;
    className?: string;
}

export const TimelineLayout = ({ 
    content, 
    actions, 
    channel,
    onOpenSettings,
    className = "" 
}: TimelineLayoutProps) => {
    return (
        <div data-component="timeline-container" className={`relative flex-1 flex flex-col h-full ${className}`}>
            {/* Channel Cover Header */}
            {channel && (
                <ChannelCoverHeader
                    channel={channel}
                    onOpenSettings={onOpenSettings}
                />
            )}
            
            {/* Timeline content area */}
            <div className="flex-1 flex flex-col min-h-0">
                {content}
            </div>
            
            {/* Actions area */}
            {actions}
        </div>
    );
};
