import { create } from "zustand";
import { AIConversation } from "@/common/types/ai-conversation";
import { firebaseAIConversationService } from "@/common/services/firebase/firebase-ai-conversation.service";

type State = {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  error: string | null;
};

type Actions = {
  createConversation: (userId: string, channelId: string, title: string) => Promise<AIConversation>;
  loadConversations: (userId: string, channelId?: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (userId: string, conversationId: string) => Promise<void>;
  updateConversation: (userId: string, conversationId: string, updates: Partial<AIConversation>) => Promise<void>;
  clearError: () => void;
};

export const useConversationStore = create<State & Actions>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  loading: true,
  error: null,

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
    set(s => ({ conversations: [optimistic, ...s.conversations], currentConversationId: tempId }));
    try {
      const created = await firebaseAIConversationService.createConversation(userId, channelId, title);
      set(s => ({
        conversations: s.conversations.map(c => (c.id === tempId ? created : c)),
        currentConversationId: created.id,
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
    set({ currentConversationId: conversationId });
  },

  async deleteConversation(userId, conversationId) {
    set({ loading: true, error: null });
    try {
      await firebaseAIConversationService.deleteConversation(userId, conversationId);
      set(s => ({
        conversations: s.conversations.filter(c => c.id !== conversationId),
        currentConversationId: s.currentConversationId === conversationId ? null : s.currentConversationId,
        loading: false,
      }));
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : "Failed to delete conversation" });
      throw err as Error;
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
}));

