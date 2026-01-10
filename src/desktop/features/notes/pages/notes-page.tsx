import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { SideViewEnum, useUIStateStore } from "@/core/stores/ui-state.store";
import { NotesLayout } from "@/desktop/features/notes/components/notes-layout";
import { AIAssistantSidebar } from "@/desktop/features/notes/features/ai-assistant/components/ai-assistant-sidebar";
import { ChannelList } from "@/desktop/features/notes/features/channel-management/components/channel-list";
import { MessageTimelineFeature } from "@/desktop/features/notes/features/message-timeline";
import { ThreadSidebar } from "@/desktop/features/notes/features/thread-management/components/thread-sidebar";
import { StudioSidebar } from "@/desktop/features/studio/components/studio-sidebar";
import { useDesktopPresenterContext } from "@/desktop/hooks/use-desktop-presenter-context";
import { useJumpToNote } from "../hooks/use-jump-to-note";
import { NotesOnboardingHost } from "@/desktop/features/notes/features/onboarding/notes-onboarding-host";
import { DesktopSettingsSidebar } from "@/desktop/features/notes/components/desktop-settings-sidebar";

export function NotesPage() {
  const presenter = useDesktopPresenterContext();
  // Use unified sideView state
  const sideView = useUIStateStore(s => s.sideView);
  const currentThreadId = useUIStateStore(s => s.currentThreadId);
  const { currentChannelId } = useNotesViewStore();
  const { jumpToNote } = useJumpToNote();
  useHandleRxEvent(presenter.rxEventBus.requestJumpToMessage$, jumpToNote);

  // Unified sidebar renderer - all panels are mutually exclusive
  const renderSidebar = () => {
    switch (sideView) {
      case SideViewEnum.THREAD:
        return (
          <ThreadSidebar
            isOpen
            onClose={() => presenter.closeThread()}
            currentThreadId={currentThreadId || undefined}
          />
        );
      case SideViewEnum.AI_ASSISTANT:
        return (
          <AIAssistantSidebar
            isOpen
            onClose={() => presenter.closeAIAssistant()}
            channelId={currentChannelId || ""}
          />
        );
      case SideViewEnum.STUDIO:
        return <StudioSidebar />;
      case SideViewEnum.SETTINGS:
        return <DesktopSettingsSidebar onClose={() => presenter.closeSettings()} />;
      default:
        return null;
    }
  };

  return (
    <>
      <NotesLayout
        sidebar={<ChannelList />}
        content={<MessageTimelineFeature />}
        rightSidebar={renderSidebar()}
      />
      <NotesOnboardingHost />
    </>
  );
}
