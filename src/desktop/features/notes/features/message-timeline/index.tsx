import { QuickSearchHotkey } from "@/common/features/note-search/components/quick-search-hotkey";
import { ExpandedEditComposer } from "@/desktop/features/notes/features/message-timeline/components/expanded-edit/expanded-edit-composer";
import { MessageInput } from "@/desktop/features/notes/features/message-timeline/components/message-input";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { useComposerStateStore } from "@/core/stores/composer-state.store";
import { ExpandedComposer } from "./components/expanded-edit/expanded-composer";
import { useEditStateStore } from "@/core/stores/edit-state.store";

interface MessageTimelineFeatureProps {
  className?: string;
}

export const MessageTimelineFeature = ({ className = "" }: MessageTimelineFeatureProps) => {
  const currentChannel = useCurrentChannel();
  useInputCollapse();
  const composerExpanded = useComposerStateStore(s => s.expanded);
  const expandedEditing = useEditStateStore(s => Boolean(s.editingMessageId && s.editMode === "expanded"));
  const overlay = expandedEditing ? <ExpandedEditComposer /> : composerExpanded ? <ExpandedComposer /> : null;
  return (
    <>
      <TimelineLayout
        channel={currentChannel || undefined}
        content={<TimelineContent />}
        actions={currentChannel && !composerExpanded && !expandedEditing ? <MessageInput /> : null}
        overlay={overlay}
        className={className}
      />
      <QuickSearchHotkey />
    </>
  );
};
