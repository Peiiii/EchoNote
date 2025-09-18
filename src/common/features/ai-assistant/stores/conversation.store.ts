import { create } from "zustand";
import { AIConversation } from "@/common/types/ai-conversation";
import { firebaseAIConversationService } from "@/common/services/firebase/firebase-ai-conversation.service";

type State = {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  error: string | null;
  selectionTick: number;
  uiView: 'list' | 'chat';
  deletingIds: string[];
};

type Actions = {
  createConversation: (userId: string, channelId: string, title: string) => Promise<AIConversation>;
  loadConversations: (userId: string, channelId?: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (userId: string, conversationId: string) => Promise<void>;
  updateConversation: (userId: string, conversationId: string, updates: Partial<AIConversation>) => Promise<void>;
  clearError: () => void;
  showList: () => void;
  showChat: () => void;
  setView: (v: 'list' | 'chat') => void;
};

export const useConversationStore = create<State & Actions>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  loading: true,
  error: null,
  selectionTick: 0,
  uiView: 'chat',
  deletingIds: [],

  async createConversation(userId, channelId, title) {
    set({ error: null });
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic: AIConversation = {
      id: tempId,
      title,
      channelId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
      isArchived: false,
    };
    set(s => ({ conversations: [optimistic, ...s.conversations], currentConversationId: tempId, uiView: 'chat' }));
    try {
      const created = await firebaseAIConversationService.createConversation(userId, channelId, title);
      set(s => ({
        conversations: s.conversations.map(c => (c.id === tempId ? created : c)),
        currentConversationId: created.id,
        uiView: 'chat',
      }));
      return created;
    } catch (err) {
      set(s => ({
        conversations: s.conversations.filter(c => c.id !== tempId),
        currentConversationId: s.currentConversationId === tempId ? null : s.currentConversationId,
        error: err instanceof Error ? err.message : "Failed to create conversation",
      }));
      throw err;
    }
  },

  async loadConversations(userId, channelId) {
    set({ loading: true, error: null });
    try {
      const list = await firebaseAIConversationService.getConversations(userId, channelId);
      const currentId = get().currentConversationId;
      set({ conversations: list, loading: false });
      if (list.length > 0 && !currentId) {
        set({ currentConversationId: list[0].id });
      }
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : "Failed to load conversations" });
    }
  },

  selectConversation(conversationId) {
    set(s => ({ currentConversationId: conversationId, selectionTick: s.selectionTick + 1, uiView: 'chat' }));
  },

  async deleteConversation(userId, conversationId) {
    set(s => ({ error: null, deletingIds: [...s.deletingIds, conversationId] }));
    const prev = get().conversations;
    const wasCurrent = get().currentConversationId === conversationId;
    // optimistic remove
    set(s => ({
      conversations: s.conversations.filter(c => c.id !== conversationId),
      currentConversationId: wasCurrent ? null : s.currentConversationId,
    }));
    try {
      await firebaseAIConversationService.deleteConversation(userId, conversationId);
    } catch (err) {
      // revert on failure
      set({
        conversations: prev,
        currentConversationId: wasCurrent ? conversationId : get().currentConversationId,
        error: err instanceof Error ? err.message : "Failed to delete conversation",
      });
      throw err as Error;
    } finally {
      set(s => ({ deletingIds: s.deletingIds.filter(id => id !== conversationId) }));
    }
  },

  async updateConversation(userId, conversationId, updates) {
    try {
      await firebaseAIConversationService.updateConversation(userId, conversationId, updates);
      set(s => ({ conversations: s.conversations.map(c => (c.id === conversationId ? { ...c, ...updates } : c)) }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update conversation" });
      throw err as Error;
    }
  },

  clearError() {
    set({ error: null });
  },

  showList() {
    set({ uiView: 'list' });
  },
  showChat() {
    set({ uiView: 'chat' });
  },
  setView(v) {
    set({ uiView: v });
  },
}));
