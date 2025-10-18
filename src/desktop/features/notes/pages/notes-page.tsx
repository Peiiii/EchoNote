import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { SideViewEnum, useUIStateStore } from "@/core/stores/ui-state.store";
import { NotesLayout } from "@/desktop/features/notes/components/notes-layout";
import { AIAssistantSidebar } from "@/desktop/features/notes/features/ai-assistant/components/ai-assistant-sidebar";
import { ChannelList } from "@/desktop/features/notes/features/channel-management/components/channel-list";
import { MessageTimelineFeature } from "@/desktop/features/notes/features/message-timeline";
import { ThreadSidebar } from "@/desktop/features/notes/features/thread-management/components/thread-sidebar";
import { useDesktopPresenterContext } from "@/desktop/hooks/use-desktop-presenter-context";
import { useJumpToNote } from "../hooks/use-jump-to-note";

export function NotesPage() {
  const presenter = useDesktopPresenterContext();
  // Use UI state store
  const sideView = useUIStateStore(s => s.sideView);
  const currentThreadId = useUIStateStore(s => s.currentThreadId);
  const { currentChannelId } = useNotesViewStore();
  const { jumpToNote } = useJumpToNote();
  useHandleRxEvent(presenter.rxEventBus.requestJumpToMessage$, jumpToNote);

  const renderSidebar = () => {
    if (sideView === SideViewEnum.THREAD) {
      return (
        <ThreadSidebar
          isOpen
          onClose={() => presenter.closeThread()}
          currentThreadId={currentThreadId || undefined}
        />
      );
    }
    if (sideView === SideViewEnum.AI_ASSISTANT) {
      return (
        <AIAssistantSidebar
          isOpen
          onClose={() => presenter.closeAIAssistant()}
          channelId={currentChannelId || ""}
        />
      );
    }
    return null;
  };

  return (
    <NotesLayout
      sidebar={<ChannelList />}
      content={<MessageTimelineFeature />}
      rightSidebar={renderSidebar()}
    />
  );
}
