import { useState, useEffect, useRef } from "react";
import { EditorToolbar } from "@/common/components/editor-toolbar";
import { Check, X, Loader2, Maximize2 } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { cn } from "@/common/lib/utils";
import { useEditor } from "@/common/hooks/use-editor";
import { isModifierKeyPressed, SHORTCUTS } from "@/common/lib/keyboard-shortcuts";

interface InlineEditorProps {
  content: string;
  onSave: () => void;
  onCancel: () => void;
  onExpand: () => void;
  isSaving: boolean;
  className?: string;
}

export function InlineEditor({
  content,
  onSave,
  onCancel,
  onExpand,
  isSaving,
  className,
}: InlineEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Select only the updater to avoid subscribing to edit content changes here
  const updateContent = useEditStateStore((s) => s.updateContent);

  useEditor({ textareaRef, updateContent, content });

  // Auto-focus when editing starts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Auto-adjust textarea height with a sensible max to avoid growing too tall
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const max = 300; // px
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, max)}px`;
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
    <div className={cn("space-y-4", className)}>
      {/* Editor area – white background to emphasize editability (dark mode keeps contrast) */}
      <div className="relative rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-sm">
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Edit your thought..."
          className="w-full min-h-[120px] max-h-[300px] resize-none bg-transparent border-0 rounded-none text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none focus:border-0 shadow-none text-slate-800 dark:text-slate-200 font-normal"
          disabled={isSaving}
          style={{
            caretColor: "#3b82f6", // Blue cursor like message input
          }}
        />
      </div>

      {/* Action Buttons - Elegant, minimal design */}
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
        <EditorToolbar
          rightActions={[
            {
              label: "Expand",
              onClick: onExpand,
              disabled: isSaving,
              icon: <Maximize2 className="w-3.5 h-3.5 mr-1.5" />,
              className:
                "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            },
            {
              label: "Cancel",
              onClick: handleCancel,
              disabled: isSaving,
              icon: <X className="w-3.5 h-3.5 mr-1.5" />,
              className:
                "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            },
            {
              label: isSaving ? "Saving..." : "Save",
              onClick: handleSave,
              disabled: isSaving || !localContent.trim(),
              icon: isSaving ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5 mr-1.5" />
              ),
              className: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
            },
          ]}
        />
      </div>
    </div>
  );
}
