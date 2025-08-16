import { useCurrentChannelMessages } from "@/core/stores/chat-data-store";
import { Message } from "@/core/stores/chat-data-store";
import { format } from "date-fns";
import { useMemo } from "react";

// Message grouping logic hook
export function useGroupedMessages() {
    const messages = useCurrentChannelMessages();

    return useMemo(() => {
        return messages.reduce((groups: Record<string, Message[]>, message: Message) => {
            const date = format(message.timestamp, 'yyyy-MM-dd');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    }, [messages]);
} 