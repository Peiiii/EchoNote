import { MobileAIAssistant } from "@/mobile/features/notes/features/ai-assistant";
import { MobileChannelList } from "@/mobile/features/notes/features/channel-management";
import { MobileSettingsSidebar } from "@/mobile/features/notes/components/mobile-settings-sidebar";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { MobileThreadSidebar } from "@/mobile/features/notes/features/thread-management";

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
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        <MobileAIAssistant
                            channelId={currentChannelId}
                            isOpen={isAIAssistantOpen}
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
