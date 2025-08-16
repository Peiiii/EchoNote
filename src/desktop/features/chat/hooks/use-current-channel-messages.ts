import { useChatDataStore } from "@/core/stores/chat-data-store";
import { useChatViewStore } from "@/core/stores/chat-view-store";

export function useCurrentChannelMessages() {
    const { messages } = useChatDataStore();
    const { currentChannelId } = useChatViewStore();
    
    return messages.filter((message) =>
        message.channelId === currentChannelId &&
        !message.parentId // Exclude thread messages
    );
}
