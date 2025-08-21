import { Message } from "@/core/stores/chat-data.store";
import { format } from "date-fns";
import { useMemo } from "react";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useChatViewStore } from '@/core/stores/chat-view.store';

// Message grouping logic hook
export function useGroupedMessages(messages?: Message[]) {
    // 如果没有传入消息，则使用store中的消息
    const storeMessages = useChatDataStore(state => state.messages);
    const currentChannelId = useChatViewStore(state => state.currentChannelId);
    
    const effectiveMessages = useMemo(() => {
        if (messages) return messages;
        
        // 过滤当前频道的消息，排除已删除的消息和回复消息
        return storeMessages.filter(message => 
            message.channelId === currentChannelId && 
            !message.parentId && 
            !message.isDeleted // 排除已删除的消息
        );
    }, [messages, storeMessages, currentChannelId]);

    return useMemo(() => {
        // 按时间排序消息（最早的在前，最新的在后）
        const sortedMessages = [...effectiveMessages].sort((a, b) => 
            a.timestamp.getTime() - b.timestamp.getTime()
        );
        
        return sortedMessages.reduce((groups: Record<string, Message[]>, message: Message) => {
            const date = format(message.timestamp, 'yyyy-MM-dd');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    }, [effectiveMessages]);
}
