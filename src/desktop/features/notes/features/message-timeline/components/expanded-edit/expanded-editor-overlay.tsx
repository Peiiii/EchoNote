import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { ExpandedEditor } from "./expanded-editor";

interface ExpandedEditorOverlayProps {
  className?: string;
}

export const ExpandedEditorOverlay = ({
  className = "",
}: ExpandedEditorOverlayProps) => {
  const presenter = useCommonPresenterContext();
  const isVisible = useEditStateStore(s =>
    Boolean(s.editingMessageId && s.editMode === "expanded")
  );
  const editContent = useEditStateStore(s => s.editContent);
  const isSaving = useEditStateStore(s => s.isSaving);

  return (
    <Dialog
      open={isVisible}
      onOpenChange={open => {
        if (!open) presenter.noteEditManager.cancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={`p-0 gap-0 overflow-hidden sm:max-w-[95vw] md:max-w-5xl w-[95vw] h-[85vh] ${className}`}
      >
        <ExpandedEditor
          content={editContent}
          onSave={() => presenter.noteEditManager.save()}
          onCancel={() => presenter.noteEditManager.cancel()}
          onCollapse={() => presenter.noteEditManager.switchToInlineMode()}
          isSaving={isSaving}
        />
      </DialogContent>
    </Dialog>
  );
};
