import { useState } from "react";

// Types
interface MobileSidebarState {
    isChannelListOpen: boolean;
    isAIAssistantOpen: boolean;
    isSettingsOpen: boolean;
}

interface MobileSidebarActions {
    openChannelList: () => void;
    closeChannelList: () => void;
    openAIAssistant: () => void;
    closeAIAssistant: () => void;
    openSettings: () => void;
    closeSettings: () => void;
    handleChannelSelect: (channelId: string) => void;
}

export const useMobileSidebars = (): MobileSidebarState & MobileSidebarActions => {
    const [isChannelListOpen, setIsChannelListOpen] = useState(false);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // 移动端特有的处理：关闭频道列表当选择频道后
    const handleChannelSelect = () => {
        setIsChannelListOpen(false);
    };

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
