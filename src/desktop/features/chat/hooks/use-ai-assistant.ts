import { useState } from "react";
import { useChatStore } from "@/core/stores/chat-store";

export const useAIAssistant = () => {
    const { currentChannelId } = useChatStore();
    
    // AI Assistant sidebar state
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [aiAssistantChannelId, setAIAssistantChannelId] = useState<string | null>(null);

    // AI Assistant handler functions
    const handleOpenAIAssistant = (channelId?: string) => {
        const targetChannelId = channelId || currentChannelId;
        if (targetChannelId) {
            setAIAssistantChannelId(targetChannelId);
            setIsAIAssistantOpen(true);
        }
    };

    const handleCloseAIAssistant = () => {
        setIsAIAssistantOpen(false);
        setAIAssistantChannelId(null);
    };

    // Current AI Assistant channel
    const currentAIAssistantChannel = aiAssistantChannelId || currentChannelId;

    return {
        // State
        isAIAssistantOpen,
        aiAssistantChannelId,
        currentAIAssistantChannel,
        
        // Handler functions
        handleOpenAIAssistant,
        handleCloseAIAssistant
    };
};
