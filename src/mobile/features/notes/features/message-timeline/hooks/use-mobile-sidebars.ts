import { useEffect, useState } from "react";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useUIStateStore } from "@/core/stores/ui-state.store";

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
    const isAIAssistantOpen = useUIStateStore(s => s.isAIAssistantOpen);
    const openAIAssistant = useUIStateStore(s => s.openAIAssistant);
    const closeAIAssistant = useUIStateStore(s => s.closeAIAssistant);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    const { setCurrentChannel } = useNotesViewStore();

    // 移动端特有的处理：切换频道并关闭频道列表
    const handleChannelSelect = (channelId: string) => {
        setCurrentChannel(channelId);
        setIsChannelListOpen(false);
    };

    useEffect(() => rxEventBusService.requestOpenAIAssistant$.listen(() => {
        const { currentChannelId } = useNotesViewStore.getState();
        if (currentChannelId) openAIAssistant(currentChannelId);
    }), [openAIAssistant]);

    return {
        // State
        isChannelListOpen,
        isAIAssistantOpen,
        isSettingsOpen,
        
        // Actions
        openChannelList: () => setIsChannelListOpen(true),
        closeChannelList: () => setIsChannelListOpen(false),
        openAIAssistant: () => {
            if (useNotesViewStore.getState().currentChannelId) {
                openAIAssistant(useNotesViewStore.getState().currentChannelId!);
            }
        },
        closeAIAssistant,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
        handleChannelSelect,
    };
};
