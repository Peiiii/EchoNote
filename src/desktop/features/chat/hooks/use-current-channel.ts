import { useChatDataStore } from "@/core/stores/chat-data-store";
import { useChatViewStore } from "@/core/stores/chat-view-store";

export function useCurrentChannel() {
    const { channels } = useChatDataStore();
    const { currentChannelId } = useChatViewStore();
    
    return channels.find((channel) => channel.id === currentChannelId) || null;
}
