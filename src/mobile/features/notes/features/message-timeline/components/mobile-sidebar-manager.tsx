import { MobileAIAssistant } from "@/mobile/features/notes/features/ai-assistant";
import { MobileChannelList } from "@/mobile/features/notes/features/channel-management";
import { MobileSettingsSidebar } from "@/mobile/features/notes/components/mobile-settings-sidebar";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { MobileThreadSidebar } from "@/mobile/features/notes/features/thread-management";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";

export const MobileSidebarManager = () => {
    const { setCurrentChannel, currentChannelId } = useNotesViewStore();
    const { 
        isChannelListOpen,
        isAIAssistantOpen,
        isSettingsOpen,
        isThreadOpen,
        closeChannelList,
        closeAIAssistant,
        closeSettings,
        closeThread
    } = useUIStateStore();
    const addThreadMessage = useNotesDataStore(state => state.addThreadMessage);

    // Handle channel selection: switch channel and close channel list
    const handleChannelSelect = (channelId: string) => {
        setCurrentChannel(channelId);
        closeChannelList();
    };

    // Handle thread message sending
    const handleSendThreadMessage = (content: string) => {
        if (currentChannelId) {
            addThreadMessage(currentChannelId, {
                content,
                sender: "user" as const,
                channelId: currentChannelId,
            });
        }
    };
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
                        className="h-[80vh] p-0 border-t border-border/60"
                        hideClose
                        onOpenAutoFocus={(e) => e.preventDefault()}
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
                <Sheet open={isThreadOpen} onOpenChange={closeThread}>
                    <SheetContent
                        side="right"
                        className="w-full max-w-md p-0 border-l border-border/60"
                    >
                        <MobileThreadSidebar
                            onSendMessage={handleSendThreadMessage}
                        />
                    </SheetContent>
                </Sheet>
            )}

            {/* Settings Sidebar */}
            <Sheet open={isSettingsOpen} onOpenChange={closeSettings}>
                <SheetContent
                    side="right"
                    className="w-full max-w-md p-0 border-l border-border/60"
                >
                    <MobileSettingsSidebar />
                </SheetContent>
            </Sheet>
        </>
    );
};
