import { Button } from "@/common/components/ui/button";
import { RichEditorLite } from "@/common/components/RichEditorLite";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useTranslation } from "react-i18next";
import { Check, Loader2, Minimize2, Save } from "lucide-react";
import { MobileChannelDropdownSelector } from "@/mobile/features/notes/features/channel-management/components/mobile-channel-dropdown-selector";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpandedSurface } from "./expanded-surface";

export function ExpandedEditComposer() {
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  const editContent = useEditStateStore(s => s.editContent);
  const isSaving = useEditStateStore(s => s.isSaving);
  const isDirty = useEditStateStore(s => s.isDirty);
  const editingMessageId = useEditStateStore(s => s.editingMessageId);
  const showDraftPromptFlag = useEditStateStore(s => s.showDraftPrompt);
  const restoredFromDraft = useEditStateStore(s => s.restoredFromDraft);
  const editingChannelId = useEditStateStore(s => s.editingChannelId);
  const channels = useNotesDataStore(s => s.channels);

  const draftEntry = useEditStateStore(
    useCallback(state => (editingMessageId ? state.drafts[editingMessageId] : undefined), [editingMessageId])
  );
  const showDraftPrompt = useMemo(
    () => showDraftPromptFlag && !!draftEntry && !restoredFromDraft,
    [showDraftPromptFlag, draftEntry, restoredFromDraft]
  );
  const [hasSavedInSession, setHasSavedInSession] = useState(false);

  const currentChannel = useMemo(() => {
    const id = editingChannelId ?? undefined;
    return id ? channels.find(c => c.id === id) : undefined;
  }, [channels, editingChannelId]);

  const handleCollapse = () => {
    presenter.noteEditManager.switchToInlineMode();
  };

  const handleSave = async () => {
    if (!editContent.trim() || !isDirty || isSaving) return;
    await presenter.noteEditManager.save(false);
    // Store state is updated by the save action. We just remember that a user-initiated save happened,
    // so we can show the "Saved" feedback until the next edit.
    setHasSavedInSession(true);
  };

  useEffect(() => {
    if (isDirty) setHasSavedInSession(false);
  }, [isDirty]);

  useEffect(() => {
    setHasSavedInSession(false);
  }, [editingMessageId]);

  const saveStatus = isSaving ? "saving" : hasSavedInSession && !isDirty ? "saved" : "idle";
  const saveStatusLabel = saveStatus === "saving" ? t("common.saving") : saveStatus === "saved" ? t("common.saved") : "";

  return (
    <ExpandedSurface
      className="w-full h-full"
      headerLeft={
        <>
          {currentChannel && (
            <div className="pointer-events-none opacity-80">
              <MobileChannelDropdownSelector
                currentChannel={currentChannel}
                channels={channels}
                onChannelSelect={() => undefined}
                className="max-w-[240px]"
              />
            </div>
          )}
          {saveStatusLabel && (
            <span className="text-xs text-slate-500 dark:text-slate-400">{saveStatusLabel}</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={isSaving || !editContent.trim() || !isDirty}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={t("common.save")}
            title={t("common.save")}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveStatus === "saved" ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </Button>
        </>
      }
      headerRight={
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
          className="h-9 w-9"
          aria-label={t("common.collapse")}
          title={t("common.collapse")}
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      }
      banner={
        showDraftPrompt ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-medium">{t("notes.expandedEditor.unsavedDraft")}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-8 rounded-md bg-amber-500 px-3 text-xs font-medium text-white transition-colors hover:bg-amber-600"
                  onClick={() => presenter.noteEditManager.applyDraft()}
                >
                  {t("notes.expandedEditor.restoreDraft")}
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md px-3 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-900 dark:text-amber-100 dark:hover:bg-amber-500/20"
                  onClick={() => presenter.noteEditManager.dismissDraftPrompt()}
                >
                  {t("common.dismiss")}
                </button>
              </div>
            </div>
          </div>
        ) : null
      }
      onKeyDownCapture={async e => {
        if (e.key === "Escape") handleCollapse();
        if (e.key.toLowerCase() === "s" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          await handleSave();
          return;
        }
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault();
          await handleSave();
        }
      }}
    >
      <RichEditorLite
        value={editContent}
        onChange={presenter.noteEditManager.updateContent}
        editable={!isSaving}
        placeholder={""}
        className="h-full"
        variant="frameless"
      />
    </ExpandedSurface>
  );
}
