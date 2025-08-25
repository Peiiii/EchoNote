export interface MobileChatPageProps {
    // 预留未来扩展的属性
    _placeholder?: never;
}

export interface MobileSidebarState {
    isChannelListOpen: boolean;
    isAIAssistantOpen: boolean;
    isSettingsOpen: boolean;
}

export interface MobileSidebarActions {
    openChannelList: () => void;
    closeChannelList: () => void;
    openAIAssistant: () => void;
    closeAIAssistant: () => void;
    openSettings: () => void;
    closeSettings: () => void;
    handleChannelSelect: (channelId: string) => void;
}
