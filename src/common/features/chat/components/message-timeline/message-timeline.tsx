import { Message } from "@/core/stores/chat-data.store";
import { EmptyState } from "./empty-state";
import { DateDivider } from "./date-divider";
import { useGroupedMessages } from "../../hooks/use-grouped-messages";

interface MessageTimelineProps {
    messages?: Message[];
    renderThoughtRecord: (message: Message, threadCount: number) => React.ReactNode;
}

export function MessageTimeline({ 
    messages, 
    renderThoughtRecord 
}: MessageTimelineProps) {
    const groupedMessages = useGroupedMessages(messages);
    
    // 检查是否有消息需要显示
    const hasMessages = Object.values(groupedMessages).some(dayMessages => 
        (dayMessages as Message[]).some((msg: Message) => 
            msg.sender === "user" && 
            !msg.parentId
        )
    );

    if (!hasMessages) {
        return <EmptyState />;
    }

    return (
        <div 
            className="w-full bg-background" 
            style={{ 
                height: 'auto', 
                minHeight: 'auto', 
                maxHeight: 'none',
                overflow: 'hidden'
            }}
        >
            {Object.entries(groupedMessages).map(([date, dayMessages]) => {
                // Filter only user messages for display (excluding thread messages)
                const userMessages = (dayMessages as Message[]).filter((msg: Message) => 
                    msg.sender === "user" && 
                    !msg.parentId // Ensure only main messages are shown, not thread messages
                );
                
                return (
                    <div key={date} className="w-full" style={{ height: 'auto', minHeight: 'auto' }}>
                        <DateDivider date={date} />

                        {/* Elegant timeline of thoughts */}
                        {userMessages.map((message: Message, index: number) => {
                            const threadMessages = (messages ?? []).filter(msg => 
                                msg.threadId === (message.threadId || message.id)
                            );
                            const threadCount = threadMessages.length > 1 ? threadMessages.length - 1 : 0;
                            
                            return (
                                <div key={message.id} className="w-full" style={{ height: 'auto', minHeight: 'auto' }}>
                                    {renderThoughtRecord(message, threadCount)}
                                    
                                    {/* Elegant separator between thoughts */}
                                    {index < userMessages.length - 1 && (
                                        <div className="border-t border-border/60" style={{ height: '1px', minHeight: '1px' }}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}
