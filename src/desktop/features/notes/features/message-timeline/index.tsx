import { QuickSearchHotkey } from "@/common/features/note-search/components/quick-search-hotkey";
import { MessageTimelineRef } from "@/common/features/notes/components/message-timeline/message-timeline";
import { useChatActions } from "@/common/features/notes/hooks/use-chat-actions";
import { Message } from "@/core/stores/notes-data.store";
import { ExpandedEditorOverlayContainer } from "@/desktop/features/notes/features/message-timeline/components/expanded-editor-overlay-container";
import { MessageInput } from "@/desktop/features/notes/features/message-timeline/components/message-input";
import { ThoughtRecord } from "@/desktop/features/notes/features/message-timeline/components/thought-record";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { useDesktopPresenterContext } from "@/desktop/hooks/use-desktop-presenter-context";
import { useCallback, useRef } from "react";

interface MessageTimelineFeatureProps {
  className?: string;
}

export const MessageTimelineFeature = ({ className = "" }: MessageTimelineFeatureProps) => {
  // Use unified timeline state management
  const  {
    handleSend,
    handleCancelReply,
    replyToMessageId,
  }  = useChatActions();

  // Get current channel for cover header
  const currentChannel = useCurrentChannel();
  const presenter = useDesktopPresenterContext();
  const timelineContentRef = useRef<MessageTimelineRef>(null);

  // Get input collapsed state for conditional rendering
  const { inputCollapsed } = useInputCollapse();

  // Render thought record function
  const renderThoughtRecord = useCallback(
    (message: Message, threadCount: number) => (
      <ThoughtRecord message={message} threadCount={threadCount} />
    ),
    []
  );

  // Create wrapper function for onSend to match MessageInput interface
  const handleSendMessage = () => {
    timelineContentRef.current?.scrollToBottom({ behavior: "instant" });
    handleSend();
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Timeline layout with content and actions */}
      <TimelineLayout
        channel={currentChannel || undefined}
        onOpenSettings={() => presenter.openSettings()}
        content={
          <div className="flex flex-1 flex-col min-h-0 relative">
            <TimelineContent ref={timelineContentRef} renderThoughtRecord={renderThoughtRecord} />
            <QuickSearchHotkey />
          </div>
        }
        actions={
          currentChannel && !inputCollapsed ? (
            <MessageInput
              onSend={handleSendMessage}
              replyToMessageId={replyToMessageId}
              onCancelReply={handleCancelReply}
            />
          ) : null
        }
      />

      {/* Expanded editor overlay (isolated from parent re-renders) */}
      <ExpandedEditorOverlayContainer />
    </div>
  );
};
