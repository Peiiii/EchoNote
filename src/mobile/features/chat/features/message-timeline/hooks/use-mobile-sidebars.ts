import { useState } from "react";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

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
    
    const { setCurrentChannel } = useNotesViewStore();

    // 移动端特有的处理：切换频道并关闭频道列表
    const handleChannelSelect = (channelId: string) => {
        setCurrentChannel(channelId);
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
