import { create } from "zustand";
import { AIConversation, ConversationContextConfig } from "@/common/types/ai-conversation";
import { firebaseAIConversationService } from "@/common/services/firebase/firebase-ai-conversation.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import type { UIMessage } from "@agent-labs/agent-chat";
import { handleAutoTitleSnapshot } from "@/common/features/ai-assistant/services/title-generator.service";

function shouldGenerateTitleForConversation(conversation: AIConversation, state: State, messages: UIMessage[]): boolean {
  if(conversation.id.startsWith("temp-")) {
    return false;
  }

  if (state.autoTitleDone[conversation.id]) {
    return false;
  }

  if (state.titleGeneratingMap[conversation.id]) {
    return false;
  }

  const hasUserMessage = messages.some(m => m.role === 'user');
  if (!hasUserMessage) {
    return false;
  }

  const isDefaultTitle = !conversation.title ||
    /^New Conversation/i.test(conversation.title) ||
    conversation.title.startsWith('temp-') ||
    conversation.title === 'Generating title...';

  return isDefaultTitle;
}

type State = {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  error: string | null;
  selectionTick: number;
  uiView: 'list' | 'chat';
  deletingIds: string[];
  showArchived: boolean;
  query: string;
  titleGeneratingMap: Record<string, boolean>;
  autoTitleEnabled: boolean;
  autoTitleDone: Record<string, boolean>;
  autoTitleMode: 'deterministic' | 'ai' | 'auto';
};

type Actions = {
  createConversation: (userId: string, title: string, contexts?: ConversationContextConfig) => Promise<AIConversation>;
  loadConversations: (userId: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (userId: string, conversationId: string) => Promise<void>;
  updateConversation: (userId: string, conversationId: string, updates: Partial<AIConversation>) => Promise<void>;
  clearError: () => void;
  showList: () => void;
  showChat: () => void;
  setView: (v: 'list' | 'chat') => void;
  setShowArchived: (v: boolean) => void;
  setQuery: (q: string) => void;
  archiveConversation: (userId: string, conversationId: string) => Promise<void>;
  unarchiveConversation: (userId: string, conversationId: string) => Promise<void>;
  setTitleGenerating: (id: string) => void;
  completeTitleGenerating: (id: string) => void;
  clearTitleGenerating: (id: string) => void;
  setAutoTitleDone: (id: string) => void;
  setAutoTitleMode: (m: 'deterministic' | 'ai' | 'auto') => void;
  onMessagesSnapshot: (conversationId: string, messages: UIMessage[]) => void;
};

export const isTempConversation = (conversationId: string) => conversationId.startsWith('temp-');

export const useConversationStore = create<State & Actions>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  loading: true,
  error: null,
  selectionTick: 0,
  uiView: 'chat',
  deletingIds: [],
  showArchived: false,
  query: '',
  titleGeneratingMap: {},
  autoTitleEnabled: true,
  autoTitleDone: {},
  // autoTitleMode: 'deterministic',
  autoTitleMode: 'ai',

  async createConversation(userId, title, contexts) {
    set({ error: null });
    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic: AIConversation = {
      id: tempId,
      title,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
      isArchived: false,
      ...(contexts ? { contexts } : {}),
    };
    set(s => ({ conversations: [optimistic, ...s.conversations], currentConversationId: tempId, uiView: 'chat' }));
    try {
      const created = await firebaseAIConversationService.createConversation(userId, title, contexts);
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

  async loadConversations(userId) {
    set({ loading: true, error: null });
    try {
      const list = await firebaseAIConversationService.getConversations(userId);
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
    // Optimistic update: apply locally first for instant UI feedback
    const prev = get().conversations;
    set(s => ({ conversations: s.conversations.map(c => (c.id === conversationId ? { ...c, ...updates } : c)) }));
    try {
      await firebaseAIConversationService.updateConversation(userId, conversationId, updates);
    } catch (err) {
      // Revert on failure
      set({ conversations: prev, error: err instanceof Error ? err.message : "Failed to update conversation" });
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

  setShowArchived(v) {
    set({ showArchived: v });
  },
  setQuery(q) {
    set({ query: q });
  },

  async archiveConversation(userId, conversationId) {
    await firebaseAIConversationService.updateConversation(userId, conversationId, { isArchived: true, updatedAt: new Date() });
    set(s => ({ conversations: s.conversations.map(c => c.id === conversationId ? { ...c, isArchived: true } : c) }));
  },
  async unarchiveConversation(userId, conversationId) {
    await firebaseAIConversationService.updateConversation(userId, conversationId, { isArchived: false, updatedAt: new Date() });
    set(s => ({ conversations: s.conversations.map(c => c.id === conversationId ? { ...c, isArchived: false } : c) }));
  },

  setTitleGenerating(id: string) {
    set(s => ({ titleGeneratingMap: { ...s.titleGeneratingMap, [id]: true } }));
  },
  completeTitleGenerating(id: string) {
    set(s => { const t = { ...s.titleGeneratingMap }; delete t[id]; return { titleGeneratingMap: t }; });
  },
  clearTitleGenerating(id: string) {
    set(s => { const t = { ...s.titleGeneratingMap }; delete t[id]; return { titleGeneratingMap: t }; });
  },
  setAutoTitleDone(id: string) {
    set(s => ({ autoTitleDone: { ...s.autoTitleDone, [id]: true } }));
  },
  setAutoTitleMode(m: 'deterministic' | 'ai' | 'auto') {
    set({ autoTitleMode: m });
  },

  onMessagesSnapshot(conversationId, messages) {
    const state = get();
    const conv = state.conversations.find(c => c.id === conversationId);
    if (!conv) return;

    if (!shouldGenerateTitleForConversation(conv, state, messages)) {
      return;
    }

    void handleAutoTitleSnapshot({
      conversationId,
      conversation: conv,
      messages,
      autoTitleEnabled: state.autoTitleEnabled,
      autoTitleMode: state.autoTitleMode,
      autoTitleDone: state.autoTitleDone,
      getUserId: () => useNotesDataStore.getState().userId,
      update: async (userId, id, title) => {
        await firebaseAIConversationService.updateConversation(userId, id, { title });
      },
      applyLocal: (id, title) => set(s => ({ conversations: s.conversations.map(c => (c.id === id ? { ...c, title } : c)) })),
      markDone: (id) => set(s => ({ autoTitleDone: { ...s.autoTitleDone, [id]: true } })),
      setTitleGenerating: (id) => get().setTitleGenerating(id),
      completeTitleGenerating: (id) => get().completeTitleGenerating(id),
    });
  },
}));
