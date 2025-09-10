import { create } from 'zustand';
import { AIConversation, AIConversationFilters } from '@/common/types/ai-conversation';
import { firebaseAIConversationService } from '@/common/services/firebase/firebase-ai-conversation.service';

export interface AIConversationState {
  // State
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  error: string | null;
  filters: AIConversationFilters;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: AIConversationFilters) => void;
  
  // Conversation management
  loadConversations: (userId: string, filters?: AIConversationFilters) => Promise<void>;
  createConversation: (
    userId: string,
    channelId: string,
    title: string,
    description?: string,
    metadata?: AIConversation['metadata']
  ) => Promise<AIConversation>;
  updateConversation: (
    userId: string,
    conversationId: string,
    updates: Partial<Omit<AIConversation, 'id' | 'userId' | 'createdAt'>>
  ) => Promise<void>;
  deleteConversation: (userId: string, conversationId: string) => Promise<void>;
  archiveConversation: (userId: string, conversationId: string, isArchived?: boolean) => Promise<void>;
  
  // Current conversation management
  setCurrentConversation: (conversationId: string | null) => void;
  loadConversation: (userId: string, conversationId: string) => Promise<AIConversation | null>;
  
  // Utility
  getCurrentConversation: () => AIConversation | null;
  clearError: () => void;
  reset: () => void;
}

export const useAIConversationStore = create<AIConversationState>()((set, get) => ({
  // Initial state
  conversations: [],
  currentConversationId: null,
  loading: false,
  error: null,
  filters: {},

  // Basic state setters
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),

  // Conversation management
  loadConversations: async (userId, filters) => {
    set({ loading: true, error: null });
    try {
      const conversations = await firebaseAIConversationService.getAIConversations(userId, filters);
      set({ conversations, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load conversations',
        loading: false 
      });
    }
  },

  createConversation: async (userId, channelId, title, description, metadata) => {
    set({ loading: true, error: null });
    try {
      const conversation: AIConversation = {
        id: crypto.randomUUID(),
        title,
        description: description || "",
        channelId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessageAt: new Date(),
        messageCount: 0,
        isArchived: false,
        metadata: metadata || {}
      };

      await firebaseAIConversationService.createAIConversation(userId, conversation);
      
      set(state => {
        // Check if conversation already exists to avoid duplicates
        const existingConversation = state.conversations.find(c => c.id === conversation.id);
        if (existingConversation) {
          return { loading: false };
        }
        
        return {
          conversations: [conversation, ...state.conversations],
          loading: false
        };
      });
      
      return conversation;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create conversation',
        loading: false 
      });
      throw error;
    }
  },

  updateConversation: async (userId, conversationId, updates) => {
    set({ loading: true, error: null });
    try {
      await firebaseAIConversationService.updateAIConversation(userId, conversationId, updates);
      
      set(state => ({
        conversations: state.conversations.map(c => 
          c.id === conversationId ? { ...c, ...updates, updatedAt: new Date() } : c
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update conversation',
        loading: false 
      });
    }
  },

  deleteConversation: async (userId, conversationId) => {
    set({ loading: true, error: null });
    try {
      await firebaseAIConversationService.deleteAIConversation(userId, conversationId);
      
      set(state => ({
        conversations: state.conversations.filter(c => c.id !== conversationId),
        currentConversationId: state.currentConversationId === conversationId ? null : state.currentConversationId,
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete conversation',
        loading: false 
      });
    }
  },

  archiveConversation: async (userId, conversationId, isArchived = true) => {
    await get().updateConversation(userId, conversationId, { isArchived });
  },

  // Current conversation management
  setCurrentConversation: (conversationId) => set({ currentConversationId: conversationId }),

  loadConversation: async (userId, conversationId) => {
    set({ loading: true, error: null });
    try {
      const conversation = await firebaseAIConversationService.getAIConversation(userId, conversationId);
      if (conversation) {
        set(state => ({
          conversations: state.conversations.some(c => c.id === conversationId)
            ? state.conversations.map(c => c.id === conversationId ? conversation : c)
            : [conversation, ...state.conversations],
          loading: false
        }));
      }
      return conversation;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load conversation',
        loading: false 
      });
      return null;
    }
  },


  // Utility functions
  getCurrentConversation: () => {
    const { conversations, currentConversationId } = get();
    return conversations.find(c => c.id === currentConversationId) || null;
  },

  reset: () => set({
    conversations: [],
    currentConversationId: null,
    loading: false,
    error: null,
    filters: {}
  })
}));
