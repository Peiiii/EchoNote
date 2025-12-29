
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { Message } from "@/core/stores/notes-data.store";

export function useEditNote(message: Message) {
  // Select only the relevant slices for this message to avoid re-rendering all items while typing
  const editingMessageId = useEditStateStore(s => s.editingMessageId);
  const globalEditContent = useEditStateStore(s => s.editContent);
  const globalEditMode = useEditStateStore(s => s.editMode);
  const globalIsSaving = useEditStateStore(s => s.isSaving);

  const isEditing = editingMessageId === message.id;
  const editContent = isEditing ? globalEditContent : message.content;
  const editMode = isEditing ? globalEditMode : "inline";
  const isSaving = isEditing ? globalIsSaving : false;
  const isExpandedEditing = isEditing && globalEditMode === "expanded";


  return {
    isEditing,
    editContent,
    editMode,
    isSaving,
    isExpandedEditing,
  };
}


