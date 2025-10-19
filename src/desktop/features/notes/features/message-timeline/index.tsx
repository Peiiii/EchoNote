import { QuickSearchHotkey } from "@/common/features/note-search/components/quick-search-hotkey";
import { MessageInput } from "@/desktop/features/notes/features/message-timeline/components/message-input";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { ExpandedEditorOverlayContainer } from "./components/expanded-edit/expanded-editor-overlay-container";

interface MessageTimelineFeatureProps {
  className?: string;
}

export const MessageTimelineFeature = ({ className = "" }: MessageTimelineFeatureProps) => {
  const currentChannel = useCurrentChannel();
  const { inputCollapsed } = useInputCollapse();

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Timeline layout with content and actions */}
      <TimelineLayout
        channel={currentChannel || undefined}
        content={
          <div className="flex flex-1 flex-col min-h-0 relative">
            <TimelineContent />
            <QuickSearchHotkey />
          </div>
        }
        actions={currentChannel && !inputCollapsed ? <MessageInput /> : null}
      />

      {/* Expanded editor overlay (isolated from parent re-renders) */}
      <ExpandedEditorOverlayContainer />
    </div>
  );
};
