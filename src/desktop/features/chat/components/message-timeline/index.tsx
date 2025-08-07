import { useCurrentChannelMessages, useChatStore } from "@/core/stores/chat-store";
import { EmptyState } from "./empty-state";
import { DateDivider } from "./date-divider";
import { ThoughtRecord } from "./thought-record";
import { ThreadSidebar } from "../features/thread-sidebar";
import { useGroupedMessages } from "./hooks";
import { useState } from "react";

export const MessageTimeline = () => {
    const groupedMessages = useGroupedMessages();
    const messages = useCurrentChannelMessages();
    const { getThreadMessages, addThreadMessage } = useChatStore();
    
    // Thread sidebar state
    const [isThreadOpen, setIsThreadOpen] = useState(false);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

    if (messages.length === 0) {
        return <EmptyState />;
    }

    const handleOpenThread = (messageId: string) => {
        setCurrentThreadId(messageId);
        setIsThreadOpen(true);
    };

    const handleCloseThread = () => {
        setIsThreadOpen(false);
        setCurrentThreadId(null);
    };

    const handleSendThreadMessage = (content: string) => {
        if (currentThreadId) {
            addThreadMessage(currentThreadId, {
                content,
                sender: "user" as const,
                channelId: messages[0]?.channelId || "",
            });
        }
    };

    const currentParentMessage = currentThreadId 
        ? messages.find(m => m.id === currentThreadId) || null
        : null;
    
    const currentThreadMessages = currentThreadId 
        ? getThreadMessages(currentThreadId)
        : [];

    return (
        <>
            <div className="w-full bg-white dark:bg-slate-950">
                <div className="w-full">
                    {Object.entries(groupedMessages).map(([date, dayMessages]) => {
                        // Filter only user messages for display
                        const userMessages = dayMessages.filter(msg => msg.sender === "user");
                        
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
                                                    onOpenThread={handleOpenThread}
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

            {/* Thread Sidebar */}
            <ThreadSidebar
                isOpen={isThreadOpen}
                onClose={handleCloseThread}
                parentMessage={currentParentMessage}
                threadMessages={currentThreadMessages}
                onSendMessage={handleSendThreadMessage}
            />
        </>
    );
}; 