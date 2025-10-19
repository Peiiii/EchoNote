import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { SideViewEnum, useUIStateStore } from "@/core/stores/ui-state.store";
import { MobileSettingsSidebar } from "@/mobile/features/notes/components/mobile-settings-sidebar";
import { MobileAIAssistant } from "@/mobile/features/notes/features/ai-assistant";
import { MobileChannelList } from "@/mobile/features/notes/features/channel-management";
import { MobileThreadSidebar } from "@/mobile/features/notes/features/thread-management";

export const MobileSidebarManager = () => {
  const presenter = useCommonPresenterContext();
  const currentChannelId = useNotesViewStore(state => state.currentChannelId);
  const isChannelListOpen = useUIStateStore(state => state.isChannelListOpen);
  const sideView = useUIStateStore(state => state.sideView);

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
      />
      {currentChannelId && (
        <Sheet open={sideView === SideViewEnum.AI_ASSISTANT} onOpenChange={presenter.closeAIAssistant}>
          <SheetContent
            side="bottom"
            className="h-[80vh] p-0 border-t border-border/60"
            hideClose
            onOpenAutoFocus={e => e.preventDefault()}
          >
            <MobileAIAssistant
              channelId={currentChannelId}
              isOpen={sideView === SideViewEnum.AI_ASSISTANT}
              onClose={() => presenter.closeAIAssistant()}
            />
          </SheetContent>
        </Sheet>
      )}
      {sideView === SideViewEnum.THREAD && (
        <Sheet open={sideView === SideViewEnum.THREAD} onOpenChange={() => presenter.closeThread()}>
          <SheetContent
            side="right"
            className="w-full max-w-md p-0 border-l border-border/60"
            hideClose
          >
            <MobileThreadSidebar onSendMessage={handleSendThreadMessage} onClose={() => presenter.closeThread()} />
          </SheetContent>
        </Sheet>
      )}
      <Sheet open={sideView === SideViewEnum.SETTINGS} onOpenChange={() => presenter.closeSettings()}>
        <SheetContent
          side="right"
          className="w-full max-w-md p-0 border-l border-border/60"
          hideClose
        >
          <MobileSettingsSidebar onClose={() => presenter.closeSettings()} />
        </SheetContent>
      </Sheet>
    </>
  );
};
