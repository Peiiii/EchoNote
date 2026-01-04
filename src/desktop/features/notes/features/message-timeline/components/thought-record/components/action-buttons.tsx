import { Bookmark, Edit2, Eye, Lightbulb, MessageCircle, FileText, Type } from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { MoveNoteModal } from "@/common/features/notes/components/move-note-modal";

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
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  const currentChannelId = useNotesViewStore(s => s.currentChannelId) || "";
  const handleDelete = async () => {
    const messagePreview =
      message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content;

    modal.confirm({
      title: t("thoughtRecord.delete.title"),
      description: t("thoughtRecord.delete.description", { preview: messagePreview }),
      okText: t("thoughtRecord.delete.confirm"),
      okLoadingText: t("thoughtRecord.delete.deleting"),
      okVariant: "destructive",
      cancelText: t("thoughtRecord.delete.cancel"),
      onOk: async () => {
        try {
          await presenter.noteManager.deleteMessage({
            messageId: message.id,
            hardDelete: false,
            channelId: currentChannelId!,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : t("thoughtRecord.delete.unknownError");
          alert(t("thoughtRecord.delete.error", { error: errorMessage }));
        }
      },
    });
  };

  const handleMove = () => {
    if (!currentChannelId) return;
    modal.show({
      content: (
        <MoveNoteModal
          fromChannelId={currentChannelId}
          onMove={async toChannelId => {
            await presenter.noteManager.moveMessage({
              messageId: message.id,
              fromChannelId: currentChannelId,
              toChannelId,
            });
          }}
        />
      ),
      showFooter: false,
      className: "max-w-md",
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
        title: t("thoughtRecord.draft.available"),
        content: (
          <div className="space-y-4">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {lastSaved ? t("thoughtRecord.draft.savedMessage", { time: lastSaved }) : t("thoughtRecord.draft.unsavedMessage")}
              <br />
              {t("thoughtRecord.draft.choose")}
            </div>
            <div className="max-h-48 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm">
              <MarkdownContent content={draftEntry.content} />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" size="sm" onClick={openWithoutRestore} className="sm:order-1">
                {t("thoughtRecord.draft.ignore")}
              </Button>
              <Button variant="ghost" size="sm" onClick={discardDraft} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/20 sm:order-0">
                {t("thoughtRecord.draft.discard")}
              </Button>
              <Button size="sm" onClick={restoreDraft} className="bg-blue-600 text-white hover:bg-blue-700 sm:order-2">
                {t("thoughtRecord.draft.restore")}
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
        title: t("thoughtRecord.editor.markdownMode"),
        disabled: false,
        enabled: true,
        active: editorMode === "markdown",
      },
      {
        icon: FileText,
        onClick: () => onEditorModeChange("wysiwyg"),
        title: t("thoughtRecord.editor.wysiwygMode"),
        disabled: false,
        enabled: true,
        active: editorMode === "wysiwyg",
      },
    ] : []),
    {
      icon: Edit2,
      onClick: handleEdit,
      title: hasDraft ? t("thoughtRecord.actions.editWithDraft") : t("thoughtRecord.actions.edit"),
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.edit.enabled,
      indicator: hasDraft,
    },
    {
      icon: Lightbulb,
      onClick: onToggleAnalysis,
      title: t("thoughtRecord.actions.toggleSparks"),
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.sparks.enabled,
    },
    {
      icon: Eye,
      onClick: undefined,
      title: t("thoughtRecord.actions.viewDetails"),
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.viewDetails.enabled,
    },
    {
      icon: Bookmark,
      onClick: undefined,
      title: t("thoughtRecord.actions.bookmark"),
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.bookmark.enabled,
    },
    {
      icon: MessageCircle,
      onClick: onReply,
      title: t("thoughtRecord.actions.reply"),
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.reply.enabled,
    },
  ].filter(button => button.enabled);

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
      {actionButtons.map(({ icon, onClick, title, disabled, active, indicator }) => (
        <ActionButton
          key={title}
          icon={icon}
          onClick={onClick}
          title={title}
          disabled={disabled}
          active={active}
          indicator={indicator}
        />
      ))}
      <MoreActionsMenu
        message={message}
        onDelete={handleDelete}
        onCopy={() => navigator.clipboard.writeText(message.content)}
        onMove={currentChannelId ? handleMove : undefined}
      />
    </div>
  );
}
