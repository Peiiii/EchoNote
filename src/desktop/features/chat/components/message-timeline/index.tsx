import { useChatDataStore } from "@/core/stores/chat-data-store";
import { Message } from "@/core/stores/chat-data-store";
import { useCurrentChannelMessages } from "@/desktop/features/chat/hooks/use-current-channel-messages";
import { EmptyState } from "./empty-state";
import { DateDivider } from "./date-divider";
import { ThoughtRecord } from "./thought-record";
import { useGroupedMessages } from "./use-grouped-messages";

interface MessageTimelineProps {
    onOpenThread: (messageId: string) => void;
}

export function MessageTimeline({ onOpenThread }: MessageTimelineProps) {
    const groupedMessages = useGroupedMessages();
    const currentChannelMessages = useCurrentChannelMessages();
    const { getThreadMessages } = useChatDataStore();

    if (currentChannelMessages.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="w-full bg-white dark:bg-slate-950">
            <div className="w-full">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => {
                    // Filter only user messages for display (excluding thread messages)
                    const userMessages = (dayMessages as Message[]).filter((msg: Message) => 
                        msg.sender === "user" && 
                        !msg.parentId // Ensure only main messages are shown, not thread messages
                    );
                    
                    return (
                        <div key={date} className="w-full">
                            <DateDivider date={date} />

                            {/* Elegant timeline of thoughts */}
                            <div className="w-full">
                                {userMessages.map((message: Message, index: number) => {
                                    const threadMessages = getThreadMessages(message.threadId || message.id);
                                    const threadCount = threadMessages.length > 1 ? threadMessages.length - 1 : 0;
                                    
                                    return (
                                        <div key={message.id} className="w-full">
                                            <ThoughtRecord 
                                                message={message} 
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
} 