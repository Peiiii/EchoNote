import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { MobileHeader } from "@/mobile/components/mobile-header";

import { MobileMessageInput } from "@/mobile/features/notes/features/message-timeline/components/mobile-message-input";
import { useInputCollapse } from "@/common/features/notes/hooks/use-input-collapse";
import { MobileTimelineContent } from "@/mobile/features/notes/features/message-timeline/components/mobile-timeline-content";
import { useMobileTimelineState } from "@/mobile/features/notes/features/message-timeline/hooks/use-mobile-timeline-state";
import { useMobileViewportHeight } from "@/mobile/features/notes/features/message-timeline/hooks/use-mobile-viewport-height";
import { useMobilePresenterContext } from "@/mobile/hooks/use-mobile-presenter-context";
import { useRef } from "react";

interface MobileNotesLayoutProps {
  currentChannelName?: string;
  replyToMessageId?: string | null;
  isAddingMessage: boolean;
  onSendMessage: (content: string) => void;
  onCancelReply: () => void;
  setReplyToMessageId: (messageId: string | null) => void;
}

export const MobileNotesLayout = ({
  currentChannelName,
  replyToMessageId,
  isAddingMessage,
  onSendMessage,
  onCancelReply,
  setReplyToMessageId,
}: MobileNotesLayoutProps) => {
  const presenter = useMobilePresenterContext();
  // Use custom hooks for state management
  const timelineState = useMobileTimelineState({
    onSendMessage,
    setReplyToMessageId,
  });

  const viewportHeight = useMobileViewportHeight();

  // Get current channel and all channels for dropdown
  const { currentChannelId } = useNotesViewStore();
  const { channels } = useNotesDataStore();
  const currentChannel = channels.find(channel => channel.id === currentChannelId);
  const { inputCollapsed } = useInputCollapse();
  const panelRef = useRef<HTMLDivElement>(null);


  // Enhanced send message handler that scrolls to bottom after sending
  const handleSendMessage = (content: string) => {
    // timelineState.handleSendMessage(content);
    channelMessageService.sendMessage({
      channelId: useNotesViewStore.getState().currentChannelId!,
      content: content,
      sender: "user",
    });
    // Auto-scroll to latest (top) after sending message
    setTimeout(() => {
      presenter.rxEventBus.requestTimelineScrollToLatest$.emit();
    }, 100);
  };

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        height: viewportHeight,
        minHeight: viewportHeight,
        maxHeight: viewportHeight,
      }}
    >
      {/* Header */}
      <MobileHeader
        currentChannelName={currentChannelName}
        currentChannel={currentChannel}
        channels={channels}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Timeline content */}
        <MobileTimelineContent onReply={timelineState.handleReply} />

        {/* Input area - only show when there's a current channel; positioned at bottom */}
        {currentChannel && (
          <div
            ref={panelRef}
            className={`flex-shrink-0 bg-transparent overflow-hidden transition-[max-height,opacity,transform,padding] duration-220 ease-out origin-bottom ${
              inputCollapsed ? "max-h-0 opacity-0 translate-y-1 py-0" : "max-h-[220px] opacity-100 translate-y-0"
            }`}
            aria-hidden={inputCollapsed}
          >
            <MobileMessageInput
              onSend={handleSendMessage}
              replyToMessageId={replyToMessageId || undefined}
              onCancelReply={onCancelReply}
              isSending={isAddingMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
