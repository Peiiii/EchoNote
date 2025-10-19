import { MarkdownContent } from "@/common/components/markdown";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useEditNote } from "@/desktop/features/notes/features/message-timeline/components/thought-record/hooks/use-edit-note";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionButtons } from "./components/action-buttons";
import { InlineEditor } from "./components/inline-editor";
import { MessageFooter } from "./components/message-footer";
import { ReadMoreWrapper } from "./components/read-more-wrapper";
import { ThoughtRecordSparks } from "./components/thought-record-sparks";
import { useNoteAnalysis } from "./hooks/use-note-analysis";
import { ThoughtRecordProps } from "./types";

export function ThoughtRecord({
  message,
  onReply,
  threadCount = 0,
}: Omit<ThoughtRecordProps, "isFirstInGroup" | "onOpenThread">) {
  const presenter = useCommonPresenterContext();
  const currentChannelId = useNotesViewStore(s => s.currentChannelId) || "";
  const userId = useNotesDataStore(s => s.userId);
  const {
    isEditing,
    editContent,
    editMode,
    isSaving,
  } = useEditNote(message);
  const { showAnalysis, aiAnalysis, hasSparks, handleToggleAnalysis } = useNoteAnalysis(message);
  const [editingTags, setEditingTags] = useState<string[]>(message.tags || []);

  useEffect(() => {
    setEditingTags(message.tags || []);
  }, [message.tags]);

  const handleTagsChange = async (newTags: string[]) => {
    setEditingTags(newTags);

    if (!userId || !currentChannelId) return;

    try {
      await presenter.noteManager.updateMessage({
        messageId: message.id,
        channelId: currentChannelId,
        updates: { tags: newTags },
        userId,
      });
    } catch (error) {
      console.error("Failed to update tags:", error);
      setEditingTags(message.tags || []);
    }
  };

  if (message.isDeleted) {
    return null;
  }

  return (
    <div className="w-full" data-component="thought-record">
      <div
        className={`group relative w-full py-4 transition-all duration-300 ease-out ${
          isEditing
            ? "bg-gray-100/60 dark:bg-gray-800/30"
            : "hover:bg-gray-100/80 dark:hover:bg-gray-800/20"
        } ${message.isNew ? "animate-in slide-in-from-bottom-5 fade-in duration-400" : ""}`}
      >
        {/* Record Header */}
        <div className="flex items-center justify-between mb-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Clock className="w-3 h-3" />
              <span>{formatTimeForSocial(message.timestamp)}</span>
            </div>
          </div>

          <ActionButtons
            onToggleAnalysis={handleToggleAnalysis}
            onReply={onReply}
            message={message}
            isEditing={isEditing}
          />
        </div>

        {/* Content Area - Show inline editor or read-only content */}
        {isEditing && editMode === "inline" ? (
          <InlineEditor
            content={editContent}
            isSaving={isSaving}
            className="px-6"
          />
        ) : (
          <div className="px-6">
            <ReadMoreWrapper maxHeight={300} messageId={message.id}>
              <MarkdownContent content={message.content} />
            </ReadMoreWrapper>
          </div>
        )}

        {/* Sparks Section - Hide when editing */}
        {!isEditing && (
          <ThoughtRecordSparks
            message={message}
            showAnalysis={showAnalysis}
            className="px-6 mx-6"
            onClose={handleToggleAnalysis}
          />
        )}

        {/* Footer - Hide when editing */}
        {!isEditing && (
          <MessageFooter
            message={message}
            editingTags={editingTags}
            onTagsChange={handleTagsChange}
            hasSparks={hasSparks}
            aiAnalysis={aiAnalysis || null}
            onToggleAnalysis={handleToggleAnalysis}
            threadCount={threadCount}
          />
        )}
      </div>
    </div>
  );
}
