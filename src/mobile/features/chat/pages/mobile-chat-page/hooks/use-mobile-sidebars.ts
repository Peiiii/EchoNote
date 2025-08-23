import { useState, useEffect } from 'react';
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { MobileSidebarState, MobileSidebarActions } from '../types';

export const useMobileSidebars = (): MobileSidebarState & MobileSidebarActions => {
    const [isChannelListOpen, setIsChannelListOpen] = useState(false);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // 移动端特有的处理：关闭频道列表当选择频道后
    const handleChannelSelect = (channelId: string) => {
        useChatViewStore.getState().setCurrentChannel(channelId);
        setIsChannelListOpen(false);
    };

    // 移动端特有的处理：关闭侧边栏当打开线程后
    useEffect(() => {
        // 这里可以添加线程相关的逻辑
        // 暂时保持空实现，后续可以扩展
    }, []);

    return {
        // State
        isChannelListOpen,
        isAIAssistantOpen,
        isSettingsOpen,
        
        // Actions
        openChannelList: () => setIsChannelListOpen(true),
        closeChannelList: () => setIsChannelListOpen(false),
        openAIAssistant: () => setIsAIAssistantOpen(true),
        closeAIAssistant: () => setIsAIAssistantOpen(false),
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
        handleChannelSelect,
    };
};
