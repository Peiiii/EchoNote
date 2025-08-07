import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { format } from "date-fns";
import { useMemo } from "react";

// 消息分组逻辑hook
export const useGroupedMessages = () => {
    const messages = useCurrentChannelMessages();
    
    return useMemo(() => {
        return messages.reduce((groups, message) => {
            const date = format(message.timestamp, 'yyyy-MM-dd');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {} as Record<string, typeof messages>);
    }, [messages]);
}; 