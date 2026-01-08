import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotesDataStore } from "./notes-data.store";
import { useNotesViewStore } from "./notes-view.store";
import { channelMessageService } from "../services/channel-message.service";
import { computeNoteHash } from "@/common/utils/note-hash";

export interface EditDraftEntry {
  content: string;
  baseHash: string;
  updatedAt: number;
}

export interface EditState {
  // Editing state
  editingMessageId: string | null;
  editingChannelId: string | null;
  editContent: string;
  originalContent: string;
  isDirty: boolean;
  isSaving: boolean;
  baseHash: string | null;
  showDraftPrompt: boolean;
  restoredFromDraft: boolean;
  drafts: Record<string, EditDraftEntry>;

  // Edit mode: inline vs expanded
  editMode: "inline" | "expanded";
  
  // Editor mode: markdown vs wysiwyg
  editorMode: "markdown" | "wysiwyg";

  // Editing actions
  startEditing: (
    messageId: string,
    content: string,
    options?: { baseHash?: string; restoreDraft?: boolean; channelId?: string }
  ) => void;
  updateContent: (content: string) => void;
  switchToExpandedMode: () => void;
  switchToInlineMode: () => void;
  setEditorMode: (mode: "markdown" | "wysiwyg") => void;
  save: (shouldCloseAfterSave?: boolean) => Promise<void>;
  cancel: () => void;
  reset: () => void;
  applyDraft: () => void;
  dismissDraftPrompt: () => void;
  clearDraft: (messageId: string) => void;
}

export const useEditStateStore = create<EditState>()(
  persist(
    (set, get) => ({
      // Initial state
      editingMessageId: null,
      editingChannelId: null,
      editContent: "",
      originalContent: "",
      isDirty: false,
      isSaving: false,
      baseHash: null,
      showDraftPrompt: false,
      restoredFromDraft: false,
      drafts: {},
      editMode: "inline",
      editorMode: "wysiwyg",

      // Start editing a message
      startEditing: (messageId, content, options) => {
        const baseHash = options?.baseHash ?? computeNoteHash(content);
        const draftEntry = get().drafts[messageId];
        const hasMatchingDraft = !!draftEntry && draftEntry.baseHash === baseHash;
        const { currentChannelId } = useNotesViewStore.getState();
        const editingChannelId = options?.channelId ?? currentChannelId ?? null;

        if (draftEntry && !hasMatchingDraft) {
          set(state => {
            const nextDrafts = { ...state.drafts };
            delete nextDrafts[messageId];
            return { drafts: nextDrafts };
          });
        }

        const shouldRestore = !!options?.restoreDraft && hasMatchingDraft;
        const restoredContent = shouldRestore && draftEntry ? draftEntry.content : content;

        const currentEditorMode = get().editorMode;
        set({
          editingMessageId: messageId,
          editingChannelId,
          editContent: restoredContent,
          originalContent: content,
          isDirty: restoredContent !== content,
          isSaving: false,
          baseHash,
          showDraftPrompt: hasMatchingDraft && !shouldRestore,
          restoredFromDraft: shouldRestore,
          editMode: "inline",
          // Preserve user's last chosen editor mode for better UX
          editorMode: currentEditorMode,
        });
      },

      // Update edit content
      updateContent: content => {
        const state = get();
        if (!state.editingMessageId) return;

        const messageId = state.editingMessageId;
        const normalizedContent = content.trim();
        const normalizedOriginal = state.originalContent.trim();
        const isDirty = normalizedContent !== normalizedOriginal;
        const shouldPersistDraft = isDirty && normalizedContent.length > 0;
        const existingDraft = state.drafts[messageId];

        const shouldSkipUpdate =
          state.editContent === content &&
          state.isDirty === isDirty &&
          ((shouldPersistDraft && existingDraft && existingDraft.content === content) ||
            (!shouldPersistDraft && (!existingDraft || state.showDraftPrompt)));

        if (shouldSkipUpdate) {
          return;
        }

        set(prev => {
          let nextDrafts = prev.drafts;

          if (shouldPersistDraft && prev.baseHash) {
            const draft = prev.drafts[messageId];
            if (!draft || draft.content !== content || draft.baseHash !== prev.baseHash) {
              nextDrafts = {
                ...prev.drafts,
                [messageId]: {
                  content,
                  baseHash: prev.baseHash,
                  updatedAt: Date.now(),
                },
              };
            }
          } else if (prev.drafts[messageId] && (!prev.showDraftPrompt || prev.restoredFromDraft)) {
            // Remove the stale draft only when it actually exists
            const { [messageId]: _removed, ...rest } = prev.drafts;
            nextDrafts = rest;
          }

          // Keep drafts bounded to avoid localStorage bloat
          const DRAFT_LIMIT = 50;
          if (Object.keys(nextDrafts).length > DRAFT_LIMIT) {
            // drop the oldest drafts by updatedAt
            const entries = Object.entries(nextDrafts).sort(
              (a, b) => (b[1].updatedAt || 0) - (a[1].updatedAt || 0)
            );
            const trimmed = entries.slice(0, DRAFT_LIMIT);
            nextDrafts = Object.fromEntries(trimmed);
          }

          return {
            editContent: content,
            isDirty,
            drafts: nextDrafts,
            showDraftPrompt: false,
          };
        });
      },

      // Switch to expanded editing mode
      switchToExpandedMode: () => {
        set({ editMode: "expanded", editorMode: "wysiwyg" });
      },

      // Switch back to inline editing mode
      switchToInlineMode: () => {
        set({ editMode: "inline" });
      },

      // Set editor mode (markdown or wysiwyg)
      setEditorMode: mode => {
        set({ editorMode: mode });
      },

      // Save the edited message
      save: async (shouldCloseAfterSave = true) => {
        const { editingMessageId, editContent, editingChannelId } = get();
        if (!editingMessageId || !editContent.trim()) return;

        set({ isSaving: true });

        try {
          const { userId } = useNotesDataStore.getState();
          if (!userId) {
            throw new Error("User not authenticated");
          }

          const fallbackChannelId = useNotesViewStore.getState().currentChannelId;
          const channelId = editingChannelId ?? fallbackChannelId;
          if (!channelId) {
            throw new Error("No current channel selected");
          }

          await channelMessageService.updateMessage({
            messageId: editingMessageId,
            channelId,
            updates: { content: editContent.trim() },
            userId,
          });

          get().clearDraft(editingMessageId);

          if (shouldCloseAfterSave) {
            get().reset();
          } else {
            set({
              isSaving: false,
              isDirty: false,
              originalContent: editContent.trim(),
              restoredFromDraft: false,
            });
          }
        } catch (error) {
          console.error("Failed to save message:", error);
        } finally {
          // Always stop the saving indicator even if the request fails.
          set(state => (state.isSaving ? { isSaving: false } : {}));
        }
      },

      // Cancel editing
      cancel: () => {
        get().reset();
      },

      // Reset editing state
      reset: () => {
        set({
          editingMessageId: null,
          editingChannelId: null,
          editContent: "",
          originalContent: "",
          isDirty: false,
          isSaving: false,
          baseHash: null,
          showDraftPrompt: false,
          restoredFromDraft: false,
          editMode: "inline",
          editorMode: "wysiwyg",
        });
      },

      applyDraft: () => {
        const { editingMessageId, drafts, originalContent } = get();
        if (!editingMessageId) return;
        const entry = drafts[editingMessageId];
        if (!entry) return;

        set({
          editContent: entry.content,
          isDirty: entry.content !== originalContent,
          showDraftPrompt: false,
          restoredFromDraft: true,
        });
      },

      dismissDraftPrompt: () => {
        const { editingMessageId } = get();
        set(state => {
          let nextDrafts = state.drafts;
          if (editingMessageId && state.drafts[editingMessageId]) {
            const { [editingMessageId]: _removed, ...rest } = state.drafts;
            nextDrafts = rest;
          }
          return nextDrafts === state.drafts
            ? { showDraftPrompt: false }
            : { showDraftPrompt: false, drafts: nextDrafts };
        });
      },

      clearDraft: messageId => {
        set(state => {
          if (!state.drafts[messageId]) {
            return {};
          }
          const nextDrafts = { ...state.drafts };
          delete nextDrafts[messageId];
          return { drafts: nextDrafts };
        });
      },
    }),
    {
      name: "echonote-edit-state-storage",
      // Persist drafts and last chosen editor mode for consistency across sessions
      partialize: state => ({ drafts: state.drafts, editorMode: state.editorMode }),
    }
  )
);
