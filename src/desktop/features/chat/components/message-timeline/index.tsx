import { useCurrentChannelMessages, useChatStore } from "@/core/stores/chat-store";
import { EmptyState } from "./empty-state";
import { DateDivider } from "./date-divider";
import { ThoughtRecord } from "./thought-record";
import { useGroupedMessages } from "./hooks";

interface MessageTimelineProps {
    onOpenThread: (messageId: string) => void;
}

export const MessageTimeline = ({ onOpenThread }: MessageTimelineProps) => {
    const groupedMessages = useGroupedMessages();
    const messages = useCurrentChannelMessages();
    const { getThreadMessages } = useChatStore();

    if (messages.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="w-full bg-white dark:bg-slate-950">
            <div className="w-full">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => {
                    // Filter only user messages for display (excluding thread messages)
                    const userMessages = dayMessages.filter(msg => 
                        msg.sender === "user" && 
                        !msg.parentId // 确保只显示主消息，不显示thread消息
                    );
                    
                    return (
                        <div key={date} className="w-full">
                            <DateDivider date={date} />

                            {/* Elegant timeline of thoughts */}
                            <div className="w-full">
                                {userMessages.map((message, index) => {
                                    const threadMessages = getThreadMessages(message.threadId || message.id);
                                    const threadCount = threadMessages.length > 1 ? threadMessages.length - 1 : 0;
                                    
                                    return (
                                        <div key={message.id} className="w-full">
                                            <ThoughtRecord 
                                                message={message} 
                                                isFirstInGroup={index === 0}
                                                onOpenThread={onOpenThread}
                                                threadCount={threadCount}
                                            />
                                            
                                            {/* Elegant separator between thoughts */}
                                            {index < userMessages.length - 1 && (
                                                <div className="w-full">
                                                    <div className="border-t border-slate-200/60 dark:border-slate-700/60"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 