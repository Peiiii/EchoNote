import { useCallback } from "react";
import { ExpandedEditorOverlay } from "./expanded-editor-overlay";
import { useEditStateStore } from "@/core/stores/edit-state.store";

// A tiny container that subscribes directly to edit state slices so that
// parent timeline components don't re-render on every keystroke.
export const ExpandedEditorOverlayContainer = () => {
  const isVisible = useEditStateStore(
    (s) => Boolean(s.editingMessageId && s.editMode === "expanded")
  );
  const editContent = useEditStateStore((s) => s.editContent);
  const isSaving = useEditStateStore((s) => s.isSaving);

  // Select stable action references (Zustand action refs are stable)
  const save = useEditStateStore((s) => s.save);
  const cancel = useEditStateStore((s) => s.cancel);
  const switchToInlineMode = useEditStateStore((s) => s.switchToInlineMode);

  // Keep callbacks stable for child
  const handleSave = useCallback(() => save(), [save]);
  const handleCancel = useCallback(() => cancel(), [cancel]);
  const handleCollapse = useCallback(() => switchToInlineMode(), [switchToInlineMode]);

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

