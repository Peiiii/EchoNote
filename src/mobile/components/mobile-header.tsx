import { Button } from "@/common/components/ui/button";
import { openQuickSearchModal } from "@/common/features/note-search/components/quick-search-modal.store";
import { Channel, useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { MobileChannelDropdownSelector } from "@/mobile/features/notes/features/channel-management/components/mobile-channel-dropdown-selector";
import { Bot, PanelLeft, Search, Settings, Plus } from "lucide-react";
import { MobileCreateChannelPopover } from "@/mobile/features/notes/features/channel-management/components/mobile-create-channel-popover";

interface MobileHeaderProps {
    currentChannelName?: string;
    currentChannel?: Channel;
    channels?: Channel[];
}

export const MobileHeader = ({ 
    currentChannelName,
    currentChannel,
    channels: _channels
}: MobileHeaderProps) => {
    const { openChannelList, openAIAssistant, openSettings } = useUIStateStore();
    const { setCurrentChannel } = useNotesViewStore();
    const { channels: allChannels } = useNotesDataStore();
    
    const handleOpenAIAssistant = () => {
        openAIAssistant();
    };
    return (
        <div className="flex-shrink-0 px-4 py-2 bg-background">
            <div className="flex items-center justify-between">
                {/* Left: Open channel list + New space (keep spacing consistent) */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={openChannelList}
                        className="h-9 w-9 dark:text-primary"
                        title="Channels"
                        aria-label="Channels"
                    >
                        <PanelLeft className="size-5"/>
                    </Button>
                    <MobileCreateChannelPopover
                        onAddChannel={(channel) => { void useNotesDataStore.getState().addChannel(channel); }}
                        trigger={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 dark:text-primary"
                                title="New space"
                                aria-label="New space"
                            >
                                <Plus className="size-5" />
                            </Button>
                        }
                    />
                </div>

                {/* Center: Current Channel Name or Dropdown */}
                <div className="flex-1 text-center min-w-0">
                    {currentChannel && allChannels.length > 1 ? (
                        <MobileChannelDropdownSelector
                            currentChannel={currentChannel}
                            channels={allChannels}
                            onChannelSelect={setCurrentChannel}
                            className="w-full"
                        />
                    ) : (
                        <h1 className="text-lg font-semibold text-foreground/90 truncate px-2 max-w-full">
                            {currentChannelName || "Chat"}
                        </h1>
                    )}
                </div>

                {/* Right: Follow desktop order (Search, AI, Settings) */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={openQuickSearchModal}
                        className="h-9 w-9 dark:text-primary"
                        title="Search"
                    >
                        <Search className="size-5"/>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleOpenAIAssistant}
                        className="h-9 w-9 dark:text-primary"
                    >
                        <Bot className="size-5"/>
                    </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={openSettings}
                            className="h-9 w-9 dark:text-primary"
                        >
                            <Settings className="size-5"/>
                        </Button>
                </div>
            </div>
        </div>
    );
};
