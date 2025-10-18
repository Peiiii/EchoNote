import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import {
  useNotesViewStore
} from "@/core/stores/notes-view.store";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { NotesLayout } from "@/desktop/features/notes/components/notes-layout";
import { AIAssistantSidebar } from "@/desktop/features/notes/features/ai-assistant/components/ai-assistant-sidebar";
import { ChannelList } from "@/desktop/features/notes/features/channel-management/components/channel-list";
import { MessageTimelineFeature } from "@/desktop/features/notes/features/message-timeline";
import { ThreadSidebar } from "@/desktop/features/notes/features/thread-management/components/thread-sidebar";
import { useJumpToNote } from "../hooks/use-jump-to-note";


export function NotesPage() {
  // Use UI state store
  const {
    isAIAssistantOpen,
    isThreadOpen,
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

  return (
    <NotesLayout
      sidebar={<ChannelList />}
      content={<MessageTimelineFeature />}
      rightSidebar={
        (isThreadOpen || isAIAssistantOpen) &&
        (isThreadOpen ? (
          <ThreadSidebar
            isOpen={isThreadOpen}
            onClose={closeThread}
            currentThreadId={currentThreadId || undefined}
          />
        ) : (
          <AIAssistantSidebar
            isOpen={isAIAssistantOpen}
            onClose={closeAIAssistant}
            channelId={currentChannelId || ""}
          />
        ))
      }
    />
  );
}
