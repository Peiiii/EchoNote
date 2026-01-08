import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { EditorToolbar } from "@/common/components/editor-toolbar";
import { Check, X, Loader2, Maximize2 } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { cn } from "@/common/lib/utils";
import { useEditor } from "@/common/hooks/use-editor";
import { isModifierKeyPressed, SHORTCUTS } from "@/common/lib/keyboard-shortcuts";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { RichEditorLite } from "@/common/components/RichEditorLite";
import { formatRelativeTime } from "@/common/lib/time-utils";

interface InlineEditorProps {
  content: string;
  isSaving: boolean;
  editorMode: "markdown" | "wysiwyg";
  onEditorModeChange: (mode: "markdown" | "wysiwyg") => void;
  className?: string;
}

export function InlineEditor({
  content,
  isSaving,
  editorMode,
  onEditorModeChange: _onEditorModeChange,
  className,
}: InlineEditorProps) {
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  const [localContent, setLocalContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Select only the updater to avoid subscribing to edit content changes here
  const updateContent = useEditStateStore(s => s.updateContent);
  const editingMessageId = useEditStateStore(s => s.editingMessageId);
  const showDraftPromptFlag = useEditStateStore(s => s.showDraftPrompt);
  const draftEntry = useEditStateStore(
    useCallback(state => (editingMessageId ? state.drafts[editingMessageId] : undefined), [editingMessageId])
  );
  const showDraftPrompt = useMemo(() => showDraftPromptFlag && !!draftEntry, [showDraftPromptFlag, draftEntry]);
  const draftUpdatedAt = draftEntry?.updatedAt;

  // Only wire markdown helpers when in markdown mode
  useEditor({ textareaRef, updateContent, content: editorMode === "markdown" ? content : "" });

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
      presenter.noteEditManager.save();
    }
  };

  const handleCancel = () => {
    presenter.noteEditManager.cancel();
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
      {showDraftPrompt && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-medium">{t("thoughtRecord.draft.found")}</span>
              {draftUpdatedAt && (
                <span className="ml-2 text-xs text-amber-700/80 dark:text-amber-100/80">
                  {t("thoughtRecord.draft.saved", { time: formatRelativeTime(new Date(draftUpdatedAt)) })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 rounded-md bg-amber-500 px-3 text-xs font-medium text-white transition-colors hover:bg-amber-600"
                onClick={() => presenter.noteEditManager.applyDraft()}
              >
                {t("thoughtRecord.draft.restore")}
              </button>
              <button
                type="button"
                className="h-8 rounded-md px-3 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-900 dark:text-amber-100 dark:hover:bg-amber-500/20"
                onClick={() => presenter.noteEditManager.dismissDraftPrompt()}
              >
                {t("thoughtRecord.draft.dismiss")}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Editor area – white background to emphasize editability (dark mode keeps contrast) */}
      <div className="relative rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        {editorMode === "markdown" ? (
          <textarea
            ref={textareaRef}
            value={localContent}
            onChange={e => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("thoughtRecord.editor.placeholder")}
            className="w-full min-h-[200px] max-h-[400px] resize-none bg-transparent border-0 rounded-none px-4 py-3 text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none focus:border-0 shadow-none text-slate-800 dark:text-slate-200 font-normal"
            disabled={isSaving}
            style={{ caretColor: "#3b82f6" }}
          />
        ) : (
          <div onKeyDown={handleKeyDown}>
            <RichEditorLite
              value={localContent}
              onChange={handleContentChange}
              editable={!isSaving}
              placeholder={t("thoughtRecord.editor.placeholder")}
              variant="frameless"
              compactToolbar
              minHeight={200}
              maxHeight={360}
              className="px-3 pt-3"
            />
          </div>
        )}
      </div>

      {/* Action Buttons - Elegant, minimal design */}
      <div className="flex items-center justify-between">
        {/* Left side - Keyboard shortcuts hint */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs border border-slate-200 dark:border-slate-700">
            {SHORTCUTS.SAVE}
          </kbd>
          <span className="ml-2">{t("thoughtRecord.editor.shortcuts.toSave")},</span>
          <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs border border-slate-200 dark:border-slate-700 ml-2">
            {SHORTCUTS.CANCEL}
          </kbd>
          <span className="ml-2">{t("thoughtRecord.editor.shortcuts.toCancel")}</span>
        </div>

        {/* Right side - Action buttons */}
        <EditorToolbar
          rightActions={[
            {
              label: t("thoughtRecord.editor.expand"),
              onClick: () => presenter.noteEditManager.switchToExpandedMode(),
              disabled: isSaving,
              icon: <Maximize2 className="w-3.5 h-3.5 mr-1.5" />,
              className:
                "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            },
            {
              label: t("thoughtRecord.editor.cancel"),
              onClick: () => presenter.noteEditManager.cancel(),
              disabled: isSaving,
              icon: <X className="w-3.5 h-3.5 mr-1.5" />,
              className:
                "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            },
            {
              label: isSaving ? t("thoughtRecord.editor.saving") : t("thoughtRecord.editor.save"),
              onClick: () => presenter.noteEditManager.save(),
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
