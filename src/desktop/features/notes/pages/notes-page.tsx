import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { SideViewEnum, useUIStateStore } from "@/core/stores/ui-state.store";
import { NotesLayout } from "@/desktop/features/notes/components/notes-layout";
import { AIAssistantSidebar } from "@/desktop/features/notes/features/ai-assistant/components/ai-assistant-sidebar";
import { ChannelList } from "@/desktop/features/notes/features/channel-management/components/channel-list";
import { MessageTimelineFeature } from "@/desktop/features/notes/features/message-timeline";
import { ThreadSidebar } from "@/desktop/features/notes/features/thread-management/components/thread-sidebar";
import { useJumpToNote } from "../hooks/use-jump-to-note";

export function NotesPage() {
  // Use UI state store
  const {
    sideView,
    currentThreadId,
    openAIAssistant,
    closeAIAssistant,
    openThread,
    closeThread,
    openSettings,
  } = useUIStateStore();
  const { currentChannelId } = useNotesViewStore();
  const { jumpToNote } = useJumpToNote();

  useHandleRxEvent(rxEventBusService.requestOpenAIAssistant$, openAIAssistant);
  useHandleRxEvent(rxEventBusService.requestOpenThread$, ({ messageId }) => openThread(messageId));
  useHandleRxEvent(rxEventBusService.requestCloseThread$, closeThread);
  useHandleRxEvent(rxEventBusService.requestOpenSettings$, openSettings);
  useHandleRxEvent(rxEventBusService.requestJumpToMessage$, jumpToNote);

  const renderSidebar = () => {
    if (sideView === SideViewEnum.THREAD) {
      return (
        <ThreadSidebar
          isOpen
          onClose={closeThread}
          currentThreadId={currentThreadId || undefined}
        />
      );
    }
    if (sideView === SideViewEnum.AI_ASSISTANT) {
      return (
        <AIAssistantSidebar
          isOpen
          onClose={closeAIAssistant}
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
