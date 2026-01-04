import { useRef } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useEditor } from "@/common/hooks/use-editor";
import { useTranslation } from "react-i18next";

interface MobileExpandedEditorProps {
  originalContent: string;
  onSave: () => void;
  onCancel: () => void;
  onCollapse: () => void;
  isSaving: boolean;
}

export const MobileExpandedEditor = ({
  originalContent,
  onSave,
  onCancel,
  onCollapse,
  isSaving,
}: MobileExpandedEditorProps) => {
  const editContent = useEditStateStore(s => s.editContent);
  const updateContent = useEditStateStore(s => s.updateContent);
  const hasChanges = editContent.trim() !== originalContent.trim();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEditor({ textareaRef, updateContent, content: editContent });

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
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onCollapse} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-foreground">{t("notes.messageTimeline.editMessage")}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            size="sm"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              hasChanges
                ? "bg-slate-600 hover:bg-slate-700 text-white shadow-sm border border-slate-500"
                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 min-h-0">
        <Textarea
          ref={textareaRef}
          value={editContent}
          onChange={handleContentChange}
          placeholder="Edit your message..."
          className="w-full h-full resize-none text-sm leading-relaxed border border-input rounded-lg p-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          autoFocus
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground text-center">
          {hasChanges ? "Unsaved changes" : "All changes saved"}
        </div>
      </div>
    </div>
  );
};
