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

// 消息状态判断函数（非hook）
export const getMessageStatus = (message: any, index: number, dayMessages: any[]) => {
    const isUserMessage = message.sender === "user";
    const isFirstInGroup = index === 0 || dayMessages[index - 1]?.sender !== message.sender;
    const isLastInGroup = index === dayMessages.length - 1 || dayMessages[index + 1]?.sender !== message.sender;
    
    return {
        isUserMessage,
        isFirstInGroup,
        isLastInGroup
    };
}; 