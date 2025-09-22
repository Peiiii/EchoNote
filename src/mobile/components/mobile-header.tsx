import { Button } from "@/common/components/ui/button";
import { Menu, Bot, Settings } from "lucide-react";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

interface MobileHeaderProps {
    currentChannelName?: string;
}

export const MobileHeader = ({ 
    currentChannelName 
}: MobileHeaderProps) => {
    const { openChannelList, openAIAssistant, openSettings } = useUIStateStore();
    const { currentChannelId } = useNotesViewStore();
    
    const handleOpenAIAssistant = () => {
        if (currentChannelId) {
            openAIAssistant(currentChannelId);
        }
    };
    return (
        <div className="flex-shrink-0 px-4 py-2 bg-background">
            <div className="flex items-center justify-between">
                {/* Left: Channel List Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={openChannelList}
                    className="h-9 w-9 dark:text-primary"
                >
                    <Menu className="h-6 w-6" />
                </Button>

                {/* Center: Current Channel Name */}
                <div className="flex-1 text-center min-w-0">
                    <h1 className="text-lg font-semibold text-foreground/90 truncate px-2 max-w-full">
                        {currentChannelName || "Chat"}
                    </h1>
                </div>

                {/* Right: AI Assistant and Settings Buttons */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleOpenAIAssistant}
                        className="h-9 w-9 dark:text-primary"
                    >
                        <Bot className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={openSettings}
                        className="h-9 w-9 dark:text-primary"
                    >
                        <Settings className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
