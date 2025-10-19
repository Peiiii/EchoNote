import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { SideViewEnum, useUIStateStore } from "@/core/stores/ui-state.store";
import { MobileSettingsSidebar } from "@/mobile/features/notes/components/mobile-settings-sidebar";
import { MobileAIAssistant } from "@/mobile/features/notes/features/ai-assistant";
import { MobileChannelList } from "@/mobile/features/notes/features/channel-management";
import { MobileThreadSidebar } from "@/mobile/features/notes/features/thread-management";

export const MobileSidebarManager = () => {
  const { setCurrentChannel, currentChannelId } = useNotesViewStore();
  const presenter = useCommonPresenterContext();
  const {
    isChannelListOpen,
    sideView,
    closeChannelList,
    closeAIAssistant,
    closeSettings,
    closeThread,
  } = useUIStateStore();

  // Handle channel selection: switch channel and close channel list
  const handleChannelSelect = (channelId: string) => {
    setCurrentChannel(channelId);
    closeChannelList();
  };

  // Handle thread message sending
  const handleSendThreadMessage = (content: string) => {
    if (currentChannelId) {
      presenter.threadManager.addThreadMessage(currentChannelId, {
        content,
        sender: "user" as const,
        channelId: currentChannelId,
      });
    }
  };
  return (
    <>
      <MobileChannelList
        isOpen={isChannelListOpen}
        onClose={closeChannelList}
        onChannelSelect={handleChannelSelect}
      />
      {currentChannelId && (
        <Sheet open={sideView === SideViewEnum.AI_ASSISTANT} onOpenChange={closeAIAssistant}>
          <SheetContent
            side="bottom"
            className="h-[80vh] p-0 border-t border-border/60"
            hideClose
            onOpenAutoFocus={e => e.preventDefault()}
          >
            <MobileAIAssistant
              channelId={currentChannelId}
              isOpen={sideView === SideViewEnum.AI_ASSISTANT}
              onClose={closeAIAssistant}
            />
          </SheetContent>
        </Sheet>
      )}
      {sideView === SideViewEnum.THREAD && (
        <Sheet open={sideView === SideViewEnum.THREAD} onOpenChange={closeThread}>
          <SheetContent
            side="right"
            className="w-full max-w-md p-0 border-l border-border/60"
            hideClose
          >
            <MobileThreadSidebar onSendMessage={handleSendThreadMessage} onClose={closeThread} />
          </SheetContent>
        </Sheet>
      )}
      <Sheet open={sideView === SideViewEnum.SETTINGS} onOpenChange={closeSettings}>
        <SheetContent
          side="right"
          className="w-full max-w-md p-0 border-l border-border/60"
          hideClose
        >
          <MobileSettingsSidebar onClose={closeSettings} />
        </SheetContent>
      </Sheet>
    </>
  );
};
