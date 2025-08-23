import { useState, useEffect, useRef } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Check, X, Loader2 } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";

interface InlineEditorProps {
  content: string;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export function InlineEditor({ content, onSave, onCancel, isSaving }: InlineEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateContent } = useEditStateStore();

  // Auto-focus and select all text when editing starts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleContentChange = (value: string) => {
    setLocalContent(value);
    updateContent(value);
  };

  const handleSave = () => {
    if (localContent.trim()) {
      onSave();
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div className="space-y-3">
      {/* Editor Textarea */}
      <Textarea
        ref={textareaRef}
        value={localContent}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Edit your thought..."
        className="min-h-[120px] resize-none border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
        disabled={isSaving}
      />
      
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isSaving}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !localContent.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-1" />
              Save
            </>
          )}
        </Button>
      </div>
      
      {/* Keyboard Shortcuts Hint */}
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">⌘+Enter</kbd> to save, <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">Esc</kbd> to cancel
      </div>
    </div>
  );
}
