import { useState, useEffect, useRef } from "react";
import { Button } from "@/common/components/ui/button";
import { Check, X, Loader2, Minimize2, Eye, EyeOff } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { MarkdownContent } from "./markdown-content";

interface ExpandedEditorProps {
  content: string;
  originalContent: string;
  onSave: () => void;
  onCancel: () => void;
  onCollapse: () => void;
  isSaving: boolean;
}

export function ExpandedEditor({ 
  content, 
  originalContent, 
  onSave, 
  onCancel, 
  onCollapse, 
  isSaving 
}: ExpandedEditorProps) {
  const [localContent, setLocalContent] = useState(content);
  const [showOriginal, setShowOriginal] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateContent } = useEditStateStore();

  // Auto-focus when component mounts
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
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header - Edit mode indicator and actions */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Editing Thought
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Toggle original content view */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOriginal(!showOriginal)}
            className="h-8 px-3 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            {showOriginal ? (
              <>
                <EyeOff className="w-3.5 h-3.5 mr-1.5" />
                Hide Original
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Show Original
              </>
            )}
          </Button>
          
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

      {/* Main editing area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Original content panel (left) */}
        {showOriginal && (
          <div className="w-1/2 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Original Content
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {originalContent.length} characters
                </div>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <MarkdownContent content={originalContent} />
              </div>
            </div>
          </div>
        )}

        {/* Editor panel (right) */}
        <div className={`${showOriginal ? 'w-1/2' : 'w-full'} flex flex-col overflow-hidden`}>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Edit Content
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                {localContent.length} characters
              </div>
            </div>
            
            {/* Editor textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Edit your thought..."
                className="w-full min-h-[400px] resize-none bg-transparent border-0 rounded-none text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none focus:border-0 shadow-none text-slate-800 dark:text-slate-200 font-normal"
                disabled={isSaving}
                style={{
                  caretColor: '#3b82f6',
                }}
              />
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
