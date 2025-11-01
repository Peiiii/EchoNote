import { useRef } from "react";
import { Textarea } from "@/common/components/ui/textarea";
import { EditorToolbar } from "@/common/components/editor-toolbar";
import { Save, X, Expand } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useEditor } from "@/common/hooks/use-editor";
import { RichEditorLite } from "@/common/components/RichEditorLite";

interface MobileInlineEditorProps {
  onSave: () => void;
  onCancel: () => void;
  onExpand: () => void;
  isSaving: boolean;
  editorMode: "markdown" | "wysiwyg";
  onEditorModeChange: (mode: "markdown" | "wysiwyg") => void;
}

export function MobileInlineEditor({
  onSave,
  onCancel,
  onExpand,
  isSaving,
  editorMode,
  onEditorModeChange: _onEditorModeChange,
}: MobileInlineEditorProps) {
  const editContent = useEditStateStore(s => s.editContent);
  const originalContent = useEditStateStore(s => s.originalContent);
  const updateContent = useEditStateStore(s => s.updateContent);
  const hasChanges = editContent.trim() !== originalContent.trim();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEditor({ textareaRef, updateContent, content: editorMode === "markdown" ? editContent : "" });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    updateContent(newContent);
  };

  const handleSave = () => {
    if (hasChanges) {
      onSave();
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-3">
      {/* Editor */}
      <div className="relative">
        {editorMode === "markdown" ? (
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={handleContentChange}
            placeholder="Edit your thought..."
            className="min-h-[120px] resize-none text-sm leading-relaxed border-2 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500"
            autoFocus
            style={{ caretColor: "#3b82f6" }}
          />
        ) : (
          <RichEditorLite
            value={editContent}
            onChange={(md) => updateContent(md)}
            editable={!isSaving}
            placeholder="Edit your thought..."
            className="min-h-[140px]"
          />
        )}
      </div>

      {/* Action Buttons */}
      <EditorToolbar
        leftActions={[
          {
            label: "Cancel",
            onClick: handleCancel,
            disabled: isSaving,
            icon: <X className="w-3 h-3 mr-1" />,
          },
          {
            label: isSaving ? "Saving..." : "Save",
            onClick: handleSave,
            disabled: !hasChanges || isSaving,
            icon: <Save className="w-3 h-3 mr-1" />,
            className: hasChanges
              ? "bg-slate-600 hover:bg-slate-700 text-white shadow-sm border border-slate-500 transition-colors duration-200"
              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed",
          },
        ]}
        rightActions={[
          {
            label: "Expand",
            onClick: onExpand,
            disabled: isSaving,
            icon: <Expand className="w-3 h-3 mr-1" />,
            variant: "outline",
          },
        ]}
      />
    </div>
  );
}
