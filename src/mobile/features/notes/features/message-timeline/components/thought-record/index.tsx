import { MarkdownContent } from "@/common/components/markdown";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Message } from "@/core/stores/notes-data.store";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useEditNote } from "@/desktop/features/notes/features/message-timeline/components/thought-record/hooks/use-edit-note";
import { useEffect, useState } from "react";
import { MobileExpandedEditor } from "./mobile-expanded-editor";
import { MobileInlineEditor } from "./mobile-inline-editor";
import { MobileMoreActionsMenu } from "./mobile-more-actions-menu";
import { MobileReadMoreWrapper } from "./mobile-read-more-wrapper";
import { MobileThoughtRecordSparks } from "./mobile-thought-record-sparks";
import { MobileThreadIndicator } from "./mobile-thread-indicator";

interface MobileThoughtRecordProps {
  message: Message;
  onReply?: () => void;
  threadCount?: number;
}

export const MobileThoughtRecord = ({
  message,
  onReply,
  threadCount = 0,
}: MobileThoughtRecordProps) => {
  const presenter = useCommonPresenterContext();
  const { isEditing, editMode, isSaving, isExpandedEditing } = useEditNote(message);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(false);
  
  // Get editor mode from store (for reading only)
  const editorMode = useEditStateStore(s => s.editorMode);

  // 重置自动生成标志
  useEffect(() => {
    if (shouldAutoGenerate) {
      setShouldAutoGenerate(false);
    }
  }, [shouldAutoGenerate]);

  // If message is deleted, don't show it
  if (message.isDeleted) {
    return null;
  }

  // Action handlers
  const handleEdit = () => {
    presenter.noteEditManager.startEditing({ messageId: message.id, content: message.content });
  };

  const handleDelete = async () => {
    const messagePreview =
      message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content;

    const confirmed = window.confirm(
      `🗑️ Delete Thought\n\n` +
        `"${messagePreview}"\n\n` +
        `⚠️ This action cannot be undone.\n` +
        `The thought will be moved to trash.\n\n` +
        `Are you sure you want to continue?`
    );

    if (confirmed) {
      await presenter.noteManager.deleteMessage({
        messageId: message.id,
        channelId: message.channelId,
      });
    }
  };

  const handleToggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  const handleGenerateSparks = () => {
    setShouldAutoGenerate(true);
    setShowAnalysis(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleReply = () => {
    onReply?.();
  };

  // Edit handlers
  const handleSave = async () => {
    await presenter.noteEditManager.save();
  };

  const handleCancel = () => {
    presenter.noteEditManager.cancel();
  };

  const handleExpand = () => {
    presenter.noteEditManager.switchToExpandedMode();
  };

  return (
    <div className="w-full flex flex-col overflow-hidden group">
      <div
        className={`relative w-full px-4 py-4 bg-muted/20 hover:bg-muted/40 transition-all duration-200 ease-out ${message.isNew ? "animate-in slide-in-from-bottom-5 fade-in duration-400" : ""}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span>{formatTimeForSocial(message.timestamp)}</span>
            </div>
            <div className="w-1 h-1 bg-muted-foreground/60 rounded-full"></div>
          </div>

          {/* More Actions Menu */}
          <MobileMoreActionsMenu
            message={message}
            isEditing={isEditing}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onCopy={handleCopy}
            onReply={onReply ? handleReply : undefined}
            onGenerateSparks={handleGenerateSparks}
            onViewDetails={() => {}}
            onBookmark={() => {}}
            editorMode={editorMode}
            onEditorModeChange={presenter.noteEditManager.setEditorMode}
          />
        </div>

        {/* Content Area - Floor content area */}
        <div className="">
          {isEditing && editMode === "inline" ? (
            <MobileInlineEditor
              onSave={handleSave}
              onCancel={handleCancel}
              onExpand={handleExpand}
              isSaving={isSaving}
              editorMode={editorMode}
              onEditorModeChange={presenter.noteEditManager.setEditorMode}
            />
          ) : (
            <MobileReadMoreWrapper maxHeight={400} messageId={message.id}>
              <MarkdownContent content={message.content} />
            </MobileReadMoreWrapper>
          )}
        </div>

        {/* Sparks Section - Floor bottom functional area */}
        {!isEditing && (
          <MobileThoughtRecordSparks
            message={message}
            showAnalysis={showAnalysis}
            onToggleAnalysis={handleToggleAnalysis}
            autoGenerate={shouldAutoGenerate}
          />
        )}

        {/* Footer - Floor bottom thread indicator */}
        {!isEditing && threadCount > 0 && (
          <div className="flex justify-end mt-4 pt-2">
            <MobileThreadIndicator threadCount={threadCount} messageId={message.id} />
          </div>
        )}

        {/* Expanded Editor Modal */}
        <Dialog
          open={isExpandedEditing}
          onOpenChange={open => {
            if (!open) {
              presenter.noteEditManager.switchToInlineMode();
            }
          }}
        >
          <DialogContent
            showCloseButton={false}
            className="h-[90vh] w-[95vw] max-w-none p-0 border-0 bg-background"
            onInteractOutside={e => {
              e.preventDefault();
            }}
          >
            <MobileExpandedEditor
              originalContent={message.content}
              onSave={handleSave}
              onCancel={handleCancel}
              onCollapse={() => presenter.noteEditManager.switchToInlineMode()}
              isSaving={isSaving}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
