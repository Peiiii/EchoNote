import { create } from "zustand";
import { useChatDataStore } from "./chat-data.store";

export interface EditState {
  // Editing state
  editingMessageId: string | null;
  editContent: string;
  originalContent: string;
  isDirty: boolean;
  isSaving: boolean;
  
  // Editing actions
  startEditing: (messageId: string, content: string) => void;
  updateContent: (content: string) => void;
  save: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export const useEditStateStore = create<EditState>()((set, get) => ({
  // Initial state
  editingMessageId: null,
  editContent: "",
  originalContent: "",
  isDirty: false,
  isSaving: false,

  // Start editing a message
  startEditing: (messageId: string, content: string) => {
    set({
      editingMessageId: messageId,
      editContent: content,
      originalContent: content,
      isDirty: false,
      isSaving: false,
    });
  },

  // Update edit content
  updateContent: (content: string) => {
    const { originalContent } = get();
    set({
      editContent: content,
      isDirty: content !== originalContent,
    });
  },

  // Save the edited message
  save: async () => {
    const { editingMessageId, editContent } = get();
    if (!editingMessageId || !editContent.trim()) return;

    set({ isSaving: true });

    try {
      // Use existing ChatDataStore to update message
      const updateMessage = useChatDataStore.getState().updateMessage;
      await updateMessage(editingMessageId, { content: editContent.trim() });
      
      // Clear editing state on success
      get().reset();
    } catch (error) {
      console.error("Failed to save message:", error);
      // Keep editing state on error so user can retry
    } finally {
      set({ isSaving: false });
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
      editContent: "",
      originalContent: "",
      isDirty: false,
      isSaving: false,
    });
  },
}));
