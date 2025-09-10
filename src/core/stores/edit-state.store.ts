import { create } from "zustand";
import { useNotesDataStore } from "./notes-data.store";
import { useNotesViewStore } from "./notes-view.store";
import { channelMessageService } from "../services/channel-message.service";

export interface EditState {
  // Editing state
  editingMessageId: string | null;
  editContent: string;
  originalContent: string;
  isDirty: boolean;
  isSaving: boolean;
  
  // Edit mode: inline vs expanded
  editMode: 'inline' | 'expanded';
  
  // Editing actions
  startEditing: (messageId: string, content: string) => void;
  updateContent: (content: string) => void;
  switchToExpandedMode: () => void;
  switchToInlineMode: () => void;
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
  editMode: 'inline',

  // Start editing a message
  startEditing: (messageId: string, content: string) => {
    set({
      editingMessageId: messageId,
      editContent: content,
      originalContent: content,
      isDirty: false,
      isSaving: false,
      editMode: 'inline', // Default to inline mode
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

  // Switch to expanded editing mode
  switchToExpandedMode: () => {
    set({ editMode: 'expanded' });
  },

  // Switch back to inline editing mode
  switchToInlineMode: () => {
    set({ editMode: 'inline' });
  },

  // Save the edited message
  save: async () => {
    const { editingMessageId, editContent } = get();
    if (!editingMessageId || !editContent.trim()) return;

    set({ isSaving: true });

    try {
      const { userId } = useNotesDataStore.getState();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { currentChannelId } = useNotesViewStore.getState();
      if (!currentChannelId) {
        throw new Error('No current channel selected');
      }

      await channelMessageService.updateMessage({
        messageId: editingMessageId,
        channelId: currentChannelId,
        updates: { content: editContent.trim() },
        userId
      });
      
      get().reset();
    } catch (error) {
      console.error("Failed to save message:", error);
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
      editMode: 'inline',
    });
  },
}));
