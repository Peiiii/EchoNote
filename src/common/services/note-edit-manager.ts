import { modal } from "@/common/components/modal";
import { computeNoteHash } from "@/common/utils/note-hash";
import { useEditStateStore } from "@/core/stores/edit-state.store";

export class NoteEditManager {
  startEditing = ({
    messageId,
    content,
    restoreDraft = false,
  }: {
    messageId: string;
    content: string;
    restoreDraft?: boolean;
  }) => {
    const baseHash = computeNoteHash(content);
    return useEditStateStore
      .getState()
      .startEditing(messageId, content, { baseHash, restoreDraft });
  };
  save = async (shouldCloseAfterSave = true) => {
    return await useEditStateStore.getState().save(shouldCloseAfterSave);
  };
  cancel = () => {
    const store = useEditStateStore.getState();
    if (store.isDirty) {
      modal.confirm({
        title: "Discard changes?",
        description: "You have unsaved edits. Are you sure you want to discard them?",
        okText: "Discard",
        okVariant: "destructive",
        cancelText: "Keep editing",
        onOk: async () => {
          const { editingMessageId } = useEditStateStore.getState();
          if (editingMessageId) {
            useEditStateStore.getState().clearDraft(editingMessageId);
          }
          useEditStateStore.getState().cancel();
        },
      });
      return;
    }
    store.cancel();
  };
  switchToExpandedMode = () => {
    return useEditStateStore.getState().switchToExpandedMode();
  };

  switchToInlineMode = () => {
    return useEditStateStore.getState().switchToInlineMode();
  };

  setEditorMode = (mode: "markdown" | "wysiwyg") => {
    return useEditStateStore.getState().setEditorMode(mode);
  };

  updateContent = (content: string) => {
    return useEditStateStore.getState().updateContent(content);
  };

  applyDraft = () => {
    return useEditStateStore.getState().applyDraft();
  };

  dismissDraftPrompt = () => {
    return useEditStateStore.getState().dismissDraftPrompt();
  };

  discardDraft = (messageId: string) => {
    return useEditStateStore.getState().clearDraft(messageId);
  };
}
