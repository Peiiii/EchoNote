import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useCallback } from "react";
import { ExpandedEditorOverlay } from "./expanded-editor-overlay";

// A tiny container that subscribes directly to edit state slices so that
// parent timeline components don't re-render on every keystroke.
export const ExpandedEditorOverlayContainer = () => {
  const isVisible = useEditStateStore(s =>
    Boolean(s.editingMessageId && s.editMode === "expanded")
  );
  const editContent = useEditStateStore(s => s.editContent);
  const isSaving = useEditStateStore(s => s.isSaving);

  // Select stable action references (Zustand action refs are stable)
  // Keep callbacks stable for child
  const handleSave = useCallback(() => useEditStateStore.getState().save(), []);
  const handleCancel = useCallback(() => useEditStateStore.getState().cancel(), []);
  const handleCollapse = useCallback(() => useEditStateStore.getState().switchToInlineMode(), []);

  return (
    <ExpandedEditorOverlay
      isVisible={isVisible}
      editContent={editContent}
      isSaving={isSaving}
      onSave={handleSave}
      onCancel={handleCancel}
      onCollapse={handleCollapse}
    />
  );
};
