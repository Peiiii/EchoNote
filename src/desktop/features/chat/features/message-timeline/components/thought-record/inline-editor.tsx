import { useState, useEffect, useRef } from "react";
import { Button } from "@/common/components/ui/button";
import { Check, X, Loader2, Maximize2 } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { cn } from "@/common/lib/utils";

interface InlineEditorProps {
  content: string;
  onSave: () => void;
  onCancel: () => void;
  onExpand: () => void;
  isSaving: boolean;
  className?: string;
}

export function InlineEditor({ content, onSave, onCancel, onExpand, isSaving, className }: InlineEditorProps) {
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

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
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
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Editor Textarea - Borderless, like message input */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Edit your thought..."
          className="w-full min-h-[120px] max-h-[200px] resize-none bg-transparent border-0 rounded-none text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none focus:border-0 shadow-none text-slate-800 dark:text-slate-200 font-normal"
          disabled={isSaving}
          style={{
            caretColor: '#3b82f6', // Blue cursor like message input
          }}
        />
      </div>
      
      {/* Action Buttons - Elegant, minimal design */}
      <div className="flex items-center justify-between">
        {/* Left side - Keyboard shortcuts hint */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs border border-slate-200 dark:border-slate-700">
            ⌘+Enter
          </kbd>
          <span className="ml-2">to save,</span>
          <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs border border-slate-200 dark:border-slate-700 ml-2">
            Esc
          </kbd>
          <span className="ml-2">to cancel</span>
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          {/* Expand to full-screen editing */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            disabled={isSaving}
            className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
            Expand
          </Button>
          
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
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
