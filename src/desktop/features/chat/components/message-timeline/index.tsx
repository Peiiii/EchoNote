import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { EmptyState } from "./empty-state";
import { DateDivider } from "./date-divider";
import { ThoughtRecord } from "./thought-record";
import { useGroupedMessages } from "./hooks";

export const MessageTimeline = () => {
    const groupedMessages = useGroupedMessages();
    const messages = useCurrentChannelMessages();

    if (messages.length === 0) {
        return <EmptyState />;
    }

    return (
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
                                {userMessages.map((message, index) => (
                                    <div key={message.id} className="w-full">
                                        <ThoughtRecord 
                                            message={message} 
                                            isFirstInGroup={index === 0}
                                        />
                                        
                                        {/* Elegant separator between thoughts */}
                                        {index < userMessages.length - 1 && (
                                            <div className="w-full">
                                                <div className="border-t border-slate-200/60 dark:border-slate-700/60"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}; 