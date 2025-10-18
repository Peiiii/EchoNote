import { QuickSearchHotkey } from "@/common/features/note-search/components/quick-search-hotkey";
import { MessageTimelineRef } from "@/common/features/notes/components/message-timeline/message-timeline";
import { Message } from "@/core/stores/notes-data.store";
import { ExpandedEditorOverlayContainer } from "@/desktop/features/notes/features/message-timeline/components/expanded-editor-overlay-container";
import { MessageInput } from "@/desktop/features/notes/features/message-timeline/components/message-input";
import { ThoughtRecord } from "@/desktop/features/notes/features/message-timeline/components/thought-record";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { useCallback, useRef } from "react";

interface MessageTimelineFeatureProps {
  className?: string;
}

export const MessageTimelineFeature = ({ className = "" }: MessageTimelineFeatureProps) => {
  const currentChannel = useCurrentChannel();
  const timelineContentRef = useRef<MessageTimelineRef>(null);
  const { inputCollapsed } = useInputCollapse();

  const onSendMessage = () => {
    timelineContentRef.current?.scrollToBottom({ behavior: "instant" });
  };

  const renderThoughtRecord = useCallback(
    (message: Message, threadCount: number) => (
      <ThoughtRecord message={message} threadCount={threadCount} />
    ),
    []
  );

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Timeline layout with content and actions */}
      <TimelineLayout
        channel={currentChannel || undefined}
        content={
          <div className="flex flex-1 flex-col min-h-0 relative">
            <TimelineContent ref={timelineContentRef} renderThoughtRecord={renderThoughtRecord} />
            <QuickSearchHotkey />
          </div>
        }
        actions={currentChannel && !inputCollapsed ? <MessageInput onSend={onSendMessage} /> : null}
      />

      {/* Expanded editor overlay (isolated from parent re-renders) */}
      <ExpandedEditorOverlayContainer />
    </div>
  );
};
