import { MarkdownContent } from "@/common/components/markdown";
import { Button } from "@/common/components/ui/button";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { Check, Loader2, Minimize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "@/common/hooks/use-editor";
import { isModifierKeyPressed, SHORTCUTS } from "@/common/lib/keyboard-shortcuts";

interface ExpandedEditorProps {
  content: string;
  onSave: () => void;
  onCancel: () => void;
  onCollapse: () => void;
  isSaving: boolean;
}

export function ExpandedEditor({
  content,
  onSave,
  onCancel,
  onCollapse,
  isSaving,
}: ExpandedEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Select only the updater to avoid subscribing to edit content changes here
  const updateContent = useEditStateStore(s => s.updateContent);

  useEditor({ textareaRef, updateContent, content });

  // Auto-focus when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [localContent]);

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
    } else if (e.key === "Enter" && isModifierKeyPressed(e)) {
      handleSave();
    }
    // Tab handling is now managed by useEditor hook
  };

  return (
    // Use min-h-0 on flex wrappers to prevent children from forcing overflow
    <div className="w-full h-full min-h-0 flex flex-col">
      {/* Header - Edit mode indicator and actions */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Editing Thought
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Collapse to inline mode */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
            Collapse
          </Button>
        </div>
      </div>

      {/* Main editing area - Left Editor + Right Preview */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Editor panel (left) */}
        <div className="w-1/2 min-h-0 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Editor</h3>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                {localContent.length} characters
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 p-6 overflow-y-auto">
            <textarea
              ref={textareaRef}
              value={localContent}
              onChange={e => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your thought in Markdown..."
              className="w-full h-full resize-none bg-transparent border-0 rounded-none text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none focus:border-0 shadow-none text-slate-800 dark:text-slate-200 font-mono"
              disabled={isSaving}
              style={{
                caretColor: "#3b82f6",
              }}
            />
          </div>
        </div>

        {/* Preview panel (right) */}
        <div className="w-1/2 min-h-0 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Preview</h3>
              <div className="text-xs text-slate-500 dark:text-slate-500">Live Preview</div>
            </div>
          </div>

          <div className="flex-1 min-h-0 p-6 overflow-y-auto">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {localContent.trim() ? (
                <MarkdownContent content={localContent} />
              ) : (
                <div className="text-slate-400 dark:text-slate-500 italic text-center py-8">
                  Start typing to see preview...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Action buttons and keyboard shortcuts */}
      <div className="px-8 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center justify-between">
          {/* Left side - Keyboard shortcuts hint */}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs border border-slate-200 dark:border-slate-700">
              {SHORTCUTS.SAVE}
            </kbd>
            <span className="ml-2">to save,</span>
            <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs border border-slate-200 dark:border-slate-700 ml-2">
              {SHORTCUTS.CANCEL}
            </kbd>
            <span className="ml-2">to cancel</span>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !localContent.trim()}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
