import { useEditStateStore } from "@/core/stores/edit-state.store";

export class NoteEditManager {
  startEditing = ({ messageId, content }: { messageId: string; content: string }) => {
    return useEditStateStore.getState().startEditing(messageId, content);
  };
  save = async (shouldCloseAfterSave = true) => {
    return await useEditStateStore.getState().save(shouldCloseAfterSave);
  };
  cancel = () => {
    return useEditStateStore.getState().cancel();
  };
  switchToExpandedMode = () => {
    return useEditStateStore.getState().switchToExpandedMode();
  };

  switchToInlineMode = () => {
    return useEditStateStore.getState().switchToInlineMode();
  };
}
