import { MobileAIAssistant } from "@/mobile/features/chat/features/ai-assistant";
import { MobileChannelList } from "@/mobile/features/chat/features/channel-management";
import { MobileSettingsSidebar } from "@/mobile/features/chat/components/mobile-settings-sidebar";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { MobileThreadSidebar } from "@/mobile/features/chat/features/thread-management";
import { Message } from "@/core/stores/chat-data.store";

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

interface MobileSidebarManagerProps extends MobileSidebarState, MobileSidebarActions {
    isThreadOpen: boolean;
    currentParentMessage: Message | null;
    currentThreadMessages: Message[];
    onSendThreadMessage: (content: string) => void;
    onCloseThread: () => void;
    currentChannelId: string | null;
}

export const MobileSidebarManager = ({
    // Sidebar states
    isChannelListOpen,
    isAIAssistantOpen,
    isSettingsOpen,
    isThreadOpen,
    
    // Sidebar actions
    closeChannelList,
    closeAIAssistant,
    closeSettings,
    
    // Thread data
    currentParentMessage,
    currentThreadMessages,
    onSendThreadMessage,
    onCloseThread,
    
    // Channel selection
    handleChannelSelect,
    currentChannelId,
}: MobileSidebarManagerProps) => {
    return (
        <>
            {/* Channel List Sidebar */}
            <MobileChannelList 
                isOpen={isChannelListOpen}
                onClose={closeChannelList}
                onChannelSelect={handleChannelSelect}
            />

            {/* AI Assistant - Bottom Sheet */}
            {currentChannelId && (
                <Sheet open={isAIAssistantOpen} onOpenChange={closeAIAssistant}>
                    <SheetContent 
                        side="bottom" 
                        className="h-[80vh] p-0 border-t border-border"
                    >
                        <MobileAIAssistant 
                            channelId={currentChannelId}
                            isOpen={isAIAssistantOpen}
                            onClose={closeAIAssistant}
                        />
                    </SheetContent>
                </Sheet>
            )}

            {/* Thread Sidebar */}
            {isThreadOpen && (
                <Sheet open={isThreadOpen} onOpenChange={onCloseThread}>
                    <SheetContent 
                        side="right" 
                        className="w-full max-w-md p-0 border-l border-border"
                    >
                        <MobileThreadSidebar
                            parentMessage={currentParentMessage}
                            threadMessages={currentThreadMessages}
                            onSendMessage={onSendThreadMessage}
                        />
                    </SheetContent>
                </Sheet>
            )}

            {/* Settings Sidebar */}
            <Sheet open={isSettingsOpen} onOpenChange={closeSettings}>
                <SheetContent 
                    side="right" 
                    className="w-full max-w-md p-0 border-l border-border"
                >
                    <MobileSettingsSidebar />
                </SheetContent>
            </Sheet>
        </>
    );
};
