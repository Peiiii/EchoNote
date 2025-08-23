import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { MobileChannelList } from "@/mobile/features/chat/components/mobile-channel-list";
import { MobileAIAssistant } from "@/mobile/features/chat/components/mobile-ai-assistant";
import { MobileThreadSidebar } from "@/mobile/features/chat/components/mobile-thread-sidebar";
import { MobileSettingsSidebar } from "./mobile-settings-sidebar";
import { MobileSidebarState, MobileSidebarActions } from '../types';

interface MobileSidebarManagerProps extends MobileSidebarState, MobileSidebarActions {
    isThreadOpen: boolean;
    currentParentMessage: any;
    currentThreadMessages: any[];
    onSendThreadMessage: (content: string) => void;
    onCloseThread: () => void;
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
            <Sheet open={isAIAssistantOpen} onOpenChange={closeAIAssistant}>
                <SheetContent 
                    side="bottom" 
                    className="h-[80vh] p-0 border-t border-border"
                >
                    <MobileAIAssistant />
                </SheetContent>
            </Sheet>

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
