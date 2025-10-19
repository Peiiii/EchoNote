
import { channelMessageService } from "@/core/services/channel-message.service";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { Message, useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useEffect, useState } from "react";

export function useEditNote(message: Message) {
  const currentChannelId = useNotesViewStore(s => s.currentChannelId) || "";
  const userId = useNotesDataStore(s => s.userId);
  const [editingTags, setEditingTags] = useState<string[]>(message.tags || []);

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

  useEffect(() => {
    setEditingTags(message.tags || []);
  }, [message.tags]);

  
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
    editingTags,
    isEditing,
    editContent,
    editMode,
    isSaving,
    handleEdit,
    handleSave,
    handleCancel,
    handleExpand,
    handleTagsChange,
  };
}


