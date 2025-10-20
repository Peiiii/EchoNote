import { QuickSearchHotkey } from "@/common/features/note-search/components/quick-search-hotkey";
import { ExpandedEditorOverlay } from "@/desktop/features/notes/features/message-timeline/components/expanded-edit/expanded-editor-overlay";
import { MessageInput } from "@/desktop/features/notes/features/message-timeline/components/message-input";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";

interface MessageTimelineFeatureProps {
  className?: string;
}

export const MessageTimelineFeature = ({ className = "" }: MessageTimelineFeatureProps) => {
  const currentChannel = useCurrentChannel();
  const { inputCollapsed } = useInputCollapse();
  return (
    <>
      <TimelineLayout
        channel={currentChannel || undefined}
        content={
          <>
            <TimelineContent />
          </>
        }
        actions={currentChannel && !inputCollapsed ? <MessageInput /> : null}
        className={className}
      />
      <ExpandedEditorOverlay />
      <QuickSearchHotkey />
    </>
  );
};
