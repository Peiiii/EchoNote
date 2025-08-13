import { useState } from "react";
import { useChatStore } from "@/core/stores/chat-store";

export const useAIAssistant = () => {
    const { currentChannelId } = useChatStore();
    
    // AI助手侧边栏状态
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [aiAssistantChannelId, setAIAssistantChannelId] = useState<string | null>(null);

    // AI助手处理函数
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

    // 当前AI助手频道
    const currentAIAssistantChannel = aiAssistantChannelId || currentChannelId;

    return {
        // 状态
        isAIAssistantOpen,
        aiAssistantChannelId,
        currentAIAssistantChannel,
        
        // 处理函数
        handleOpenAIAssistant,
        handleCloseAIAssistant
    };
};
