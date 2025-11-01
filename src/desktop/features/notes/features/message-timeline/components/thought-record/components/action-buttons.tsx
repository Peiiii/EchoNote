import { Bookmark, Edit2, Eye, Lightbulb, MessageCircle, FileText, Type } from "lucide-react";
import { ActionButton } from "./action-button";
import { MoreActionsMenu } from "./more-actions-menu";
import { ActionButtonsProps } from "../types";
import { getFeaturesConfig } from "@/core/config/features.config";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { modal } from "@/common/components/modal";
import { MarkdownContent } from "@/common/components/markdown";
import { Button } from "@/common/components/ui/button";
import { formatRelativeTime } from "@/common/lib/time-utils";

export function ActionButtons({
  onToggleAnalysis,
  onReply,
  message,
  isEditing,
  editorMode,
  onEditorModeChange,
  hasDraft = false,
  draftEntry = null,
}: ActionButtonsProps) {
  const presenter = useCommonPresenterContext();
  const currentChannelId = useNotesViewStore(s => s.currentChannelId) || "";
  const handleDelete = async () => {
    const messagePreview =
      message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content;

    modal.confirm({
      title: "Delete Thought",
      description: `This will move the thought to trash.\n\n"${messagePreview}"\n\nThis action cannot be undone.`,
      okText: "Delete",
      okLoadingText: "Deleting...",
      okVariant: "destructive",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await presenter.noteManager.deleteMessage({
            messageId: message.id,
            hardDelete: false,
            channelId: currentChannelId!,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          alert(`❌ Failed to delete the message.\n\nError: ${errorMessage}\n\nPlease try again.`);
        }
      },
    });
  };

  const handleEdit = () => {
    if (hasDraft && draftEntry?.content) {
      const lastSaved = draftEntry.updatedAt ? formatRelativeTime(new Date(draftEntry.updatedAt)) : null;

      const restoreDraft = () => {
        modal.close();
        presenter.noteEditManager.startEditing({
          messageId: message.id,
          content: message.content,
          restoreDraft: true,
        });
      };

      const discardDraft = () => {
        presenter.noteEditManager.discardDraft(message.id);
        modal.close();
        presenter.noteEditManager.startEditing({ messageId: message.id, content: message.content });
      };

      const openWithoutRestore = () => {
        modal.close();
        presenter.noteEditManager.startEditing({ messageId: message.id, content: message.content });
      };

      modal.show({
        title: "Unsaved draft available",
        content: (
          <div className="space-y-4">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {lastSaved ? `We kept a draft saved ${lastSaved}.` : "We kept an unsaved draft for you."}
              <br />
              Choose how you want to continue.
            </div>
            <div className="max-h-48 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm">
              <MarkdownContent content={draftEntry.content} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" size="sm" onClick={openWithoutRestore} className="sm:order-1">
                Ignore draft
              </Button>
              <Button variant="ghost" size="sm" onClick={discardDraft} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/20 sm:order-0">
                Discard draft
              </Button>
              <Button size="sm" onClick={restoreDraft} className="bg-blue-600 text-white hover:bg-blue-700 sm:order-2">
                Restore draft
              </Button>
            </div>
          </div>
        ),
        showFooter: false,
        className: "max-w-xl",
      });
      return;
    }

    presenter.noteEditManager.startEditing({ messageId: message.id, content: message.content });
  };

  const actionButtons = [
    // Editor mode toggle buttons (only show when editing)
    ...(isEditing && editorMode && onEditorModeChange ? [
      {
        icon: Type,
        onClick: () => onEditorModeChange("markdown"),
        title: "Markdown mode",
        disabled: false,
        enabled: true,
        active: editorMode === "markdown",
      },
      {
        icon: FileText,
        onClick: () => onEditorModeChange("wysiwyg"),
        title: "WYSIWYG mode",
        disabled: false,
        enabled: true,
        active: editorMode === "wysiwyg",
      },
    ] : []),
    {
      icon: Edit2,
      onClick: handleEdit,
      title: hasDraft ? "Edit thought (draft available)" : "Edit thought",
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.edit.enabled,
      indicator: hasDraft,
    },
    {
      icon: Lightbulb,
      onClick: onToggleAnalysis,
      title: "Toggle sparks",
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.sparks.enabled,
    },
    {
      icon: Eye,
      onClick: undefined,
      title: "View details",
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.viewDetails.enabled,
    },
    {
      icon: Bookmark,
      onClick: undefined,
      title: "Bookmark",
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.bookmark.enabled,
    },
    {
      icon: MessageCircle,
      onClick: onReply,
      title: "Reply to thought",
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.reply.enabled,
    },
  ].filter(button => button.enabled);

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
      {actionButtons.map(({ icon, onClick, title, disabled, active, indicator }) => (
        <ActionButton key={title} icon={icon} onClick={onClick} title={title} disabled={disabled} active={active} indicator={indicator} />
      ))}
      <MoreActionsMenu
        message={message}
        onDelete={handleDelete}
        onCopy={() => navigator.clipboard.writeText(message.content)}
      />
    </div>
  );
}
