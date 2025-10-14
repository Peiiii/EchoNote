import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Clock } from "lucide-react";
import { InlineEditor } from "./inline-editor";
import { ReadMoreWrapper } from "./read-more-wrapper";
import { ThoughtRecordSparks } from "./thought-record-sparks";
import { MarkdownContent } from "@/common/components/markdown";
import { ActionButtons } from "./components/action-buttons";
import { MessageFooter } from "./components/message-footer";
import { useThoughtRecord } from "./hooks/use-thought-record";
import { ThoughtRecordProps } from "./types";

export function ThoughtRecord({
  message,
  onReply,
  threadCount = 0,
}: Omit<ThoughtRecordProps, "isFirstInGroup" | "onOpenThread">) {
  const {
    showAnalysis,
    editingTags,
    isEditing,
    aiAnalysis,
    hasSparks,
    editContent,
    editMode,
    isSaving,
    handleDelete,
    handleToggleAnalysis,
    handleEdit,
    handleSave,
    handleCancel,
    handleExpand,
    handleTagsChange,
  } = useThoughtRecord(message);

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
            onEdit={handleEdit}
            message={message}
            onDelete={handleDelete}
            isEditing={isEditing}
          />
        </div>

        {/* Content Area - Show inline editor or read-only content */}
        {isEditing && editMode === "inline" ? (
          <InlineEditor
            content={editContent}
            onSave={handleSave}
            onCancel={handleCancel}
            onExpand={handleExpand}
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
