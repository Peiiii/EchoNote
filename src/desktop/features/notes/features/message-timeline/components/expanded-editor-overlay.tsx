import { ExpandedEditor } from "./thought-record/expanded-editor";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";

interface ExpandedEditorOverlayProps {
  isVisible: boolean;
  editContent: string;
  isSaving: boolean;
  onSave: () => Promise<void>;
  onCancel: () => void;
  onCollapse: () => void;
  className?: string;
}

export const ExpandedEditorOverlay = ({
  isVisible,
  editContent,
  isSaving,
  onSave,
  onCancel,
  onCollapse,
  className = "",
}: ExpandedEditorOverlayProps) => {
  return (
    <Dialog
      open={isVisible}
      onOpenChange={open => {
        if (!open) onCancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={`p-0 gap-0 overflow-hidden sm:max-w-[95vw] md:max-w-5xl w-[95vw] h-[85vh] ${className}`}
      >
        <ExpandedEditor
          content={editContent}
          onSave={onSave}
          onCancel={onCancel}
          onCollapse={onCollapse}
          isSaving={isSaving}
        />
      </DialogContent>
    </Dialog>
  );
};
