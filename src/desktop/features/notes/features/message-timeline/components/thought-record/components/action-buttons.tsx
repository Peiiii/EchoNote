import { Bookmark, Edit2, Eye, Lightbulb, MessageCircle } from "lucide-react";
import { ActionButton } from "./action-button";
import { MoreActionsMenu } from "../more-actions-menu";
import { ActionButtonsProps } from "../types";
import { getFeaturesConfig } from "@/core/config/features.config";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { modal } from "@/common/components/modal";

export function ActionButtons({
  onToggleAnalysis,
  onReply,
  onEdit,
  message,
  isEditing,
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

  const actionButtons = [
    {
      icon: Edit2,
      onClick: onEdit,
      title: "Edit thought",
      disabled: isEditing,
      enabled: getFeaturesConfig().channel.thoughtRecord.edit.enabled,
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
      {actionButtons.map(({ icon, onClick, title, disabled }) => (
        <ActionButton key={title} icon={icon} onClick={onClick} title={title} disabled={disabled} />
      ))}
      <MoreActionsMenu
        message={message}
        onDelete={handleDelete}
        onCopy={() => navigator.clipboard.writeText(message.content)}
      />
    </div>
  );
}
