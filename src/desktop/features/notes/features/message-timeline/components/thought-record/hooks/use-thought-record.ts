import { useState, useEffect } from "react";
import { useModal } from "@/common/components/modal/hooks";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useEditStateStore } from "@/core/stores/edit-state.store";

export function useThoughtRecord(message: Message) {
  const { currentChannelId } = useNotesViewStore();
  const { userId } = useNotesDataStore();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [editingTags, setEditingTags] = useState<string[]>(message.tags || []);

  const deleteMessage = channelMessageService.deleteMessage;

  // Select only the relevant slices for this message to avoid re-rendering all items while typing
  const editingMessageId = useEditStateStore(s => s.editingMessageId);
  const globalEditContent = useEditStateStore(s => s.editContent);
  const globalEditMode = useEditStateStore(s => s.editMode);
  const globalIsSaving = useEditStateStore(s => s.isSaving);
  const startEditing = useEditStateStore(s => s.startEditing);
  const save = useEditStateStore(s => s.save);
  const cancel = useEditStateStore(s => s.cancel);
  const switchToExpandedMode = useEditStateStore(s => s.switchToExpandedMode);

  const isEditing = editingMessageId === message.id;
  const editContent = isEditing ? globalEditContent : message.content;
  const editMode = isEditing ? globalEditMode : "inline";
  const isSaving = isEditing ? globalIsSaving : false;
  const aiAnalysis = message.aiAnalysis;
  const hasSparks = Boolean(aiAnalysis?.insights?.length);
  const { confirm } = useModal();

  useEffect(() => {
    setEditingTags(message.tags || []);
  }, [message.tags]);

  const handleDelete = async () => {
    const messagePreview =
      message.content.length > 100 ? `${message.content.substring(0, 100)}...` : message.content;

    confirm({
      title: "Delete Thought",
      description:
        `This will move the thought to trash.\n\n"${messagePreview}"\n\nThis action cannot be undone.`,
      okText: "Delete",
      okLoadingText: "Deleting...",
      okVariant: "destructive",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteMessage({
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

  const handleToggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  const handleEdit = () => {
    startEditing(message.id, message.content);
  };

  const handleSave = async () => {
    await save();
  };

  const handleCancel = () => {
    cancel();
  };

  const handleExpand = () => {
    switchToExpandedMode();
  };

  const handleTagsChange = async (newTags: string[]) => {
    setEditingTags(newTags);

    if (!userId || !currentChannelId) return;

    try {
      await channelMessageService.updateMessage({
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

  return {
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
  };
}
