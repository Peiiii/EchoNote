import { RefObject } from "react";
import { Message } from "@/core/stores/chat-data.store";
import { MobileThoughtRecord } from "../message-timeline/thought-record";

interface MobileMessageTimelineContainerProps {
    containerRef: RefObject<HTMLDivElement | null>;
    onOpenThread: (messageId: string) => void;
    messages: Message[];
    className?: string;
}

export const MobileMessageTimelineContainer = ({
    containerRef,
    onOpenThread,
    messages,
    className = ""
}: MobileMessageTimelineContainerProps) => {
    // Filter only user messages for display (excluding thread messages)
    // Same logic as desktop version
    const filteredMessages = messages.filter((msg: Message) => 
        msg.sender === "user" && 
        !msg.parentId // Ensure only main messages are shown, not thread messages
    );

    return (
        <div
            ref={containerRef}
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${className}`}
        >
            {filteredMessages.map((message) => (
                <MobileThoughtRecord
                    key={message.id}
                    message={message}
                    onOpenThread={onOpenThread}
                />
            ))}
        </div>
    );
};
