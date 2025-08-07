import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { EmptyState } from "./empty-state";
import { DateDivider } from "./date-divider";
import { UserMessage } from "./user-message";
import { AIMessage } from "./ai-message";
import { useGroupedMessages, getMessageStatus } from "./hooks";

export const MessageTimeline = () => {
    const groupedMessages = useGroupedMessages();
    const messages = useCurrentChannelMessages();

    if (messages.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                    <div key={date} className="space-y-6">
                        <DateDivider date={date} />

                        {/* Messages for the day */}
                        <div className="space-y-2">
                            {dayMessages.map((message, index) => {
                                const { isUserMessage, isFirstInGroup } = getMessageStatus(message, index, dayMessages);
                                
                                return (
                                    <div key={message.id} className="group">
                                        {isUserMessage ? (
                                            <UserMessage 
                                                message={message} 
                                                isFirstInGroup={isFirstInGroup}
                                            />
                                        ) : (
                                            <AIMessage 
                                                message={message} 
                                                isFirstInGroup={isFirstInGroup}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 