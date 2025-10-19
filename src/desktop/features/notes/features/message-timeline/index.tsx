import { QuickSearchHotkey } from "@/common/features/note-search/components/quick-search-hotkey";
import { MessageTimelineRef } from "@/common/features/notes/components/message-timeline/message-timeline";
import { MessageInput } from "@/desktop/features/notes/features/message-timeline/components/message-input";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { useRef } from "react";
import { ExpandedEditorOverlayContainer } from "./components/expanded-edit/expanded-editor-overlay-container";

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

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Timeline layout with content and actions */}
      <TimelineLayout
        channel={currentChannel || undefined}
        content={
          <div className="flex flex-1 flex-col min-h-0 relative">
            <TimelineContent ref={timelineContentRef} />
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
