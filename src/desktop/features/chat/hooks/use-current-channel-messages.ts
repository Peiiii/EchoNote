import { usePaginatedMessages } from "@/common/features/chat/hooks/use-paginated-messages";

export function useCurrentChannelMessages() {
    const { messages } = usePaginatedMessages(20);
    
    // Filter out thread messages (keep only parent messages)
    return messages.filter((message) => !message.parentId);
}
