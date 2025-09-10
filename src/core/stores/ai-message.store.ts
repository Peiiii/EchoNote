import { create } from 'zustand';
import { AIConversationMessage } from '@/common/types/ai-conversation';
import { firebaseAIConversationService } from '@/common/services/firebase/firebase-ai-conversation.service';

export interface AIMessageState {
  // State
  messagesByConversation: Record<string, AIConversationMessage[]>;
  loading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Message management
  loadMessages: (userId: string, conversationId: string) => Promise<AIConversationMessage[]>;
  addMessage: (
    userId: string,
    conversationId: string,
    message: Omit<AIConversationMessage, 'id' | 'timestamp' | 'conversationId'>
  ) => Promise<AIConversationMessage>;
  updateMessage: (
    userId: string,
    messageId: string,
    updates: Partial<Omit<AIConversationMessage, 'id' | 'conversationId' | 'timestamp'>>
  ) => Promise<void>;
  deleteMessage: (userId: string, messageId: string) => Promise<void>;

  // Utility
  getMessages: (conversationId: string) => AIConversationMessage[];
  clearMessages: (conversationId: string) => void;
  reset: () => void;
}

export const useAIMessageStore = create<AIMessageState>()((set, get) => ({
  // Initial state
  messagesByConversation: {},
  loading: false,
  error: null,

  // Basic state setters
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Message management
  loadMessages: async (userId, conversationId) => {
    set({ loading: true, error: null });
    try {
      const messages = await firebaseAIConversationService.getAIConversationMessages(userId, conversationId);
      set(state => ({
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: messages
        },
        loading: false
      }));
      return messages;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load messages',
        loading: false 
      });
      return [];
    }
  },

  addMessage: async (userId, conversationId, message) => {
    try {
      console.log("[AIMessageStore] Adding message:", { conversationId, message });
      const fullMessage: AIConversationMessage = {
        ...message,
        id: crypto.randomUUID(),
        conversationId,
        timestamp: new Date()
      };

      await firebaseAIConversationService.createAIConversationMessage(userId, fullMessage);
      
      set(state => {
        const currentMessages = state.messagesByConversation[conversationId] || [];
        
        // Check if message already exists to avoid duplicates
        const existingMessage = currentMessages.find(m => m.id === fullMessage.id);
        if (existingMessage) {
          console.log("[AIMessageStore] Message already exists, skipping:", fullMessage.id);
          return state; // Return unchanged state if message already exists
        }
        
        console.log("[AIMessageStore] Adding new message to state:", fullMessage.id);
        return {
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [...currentMessages, fullMessage]
          }
        };
      });
      
      return fullMessage;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add message'
      });
      throw error;
    }
  },

  updateMessage: async (userId, messageId, updates) => {
    try {
      await firebaseAIConversationService.updateAIConversationMessage(userId, messageId, updates);
      
      set(state => {
        const newMessagesByConversation = { ...state.messagesByConversation };
        Object.keys(newMessagesByConversation).forEach(conversationId => {
          newMessagesByConversation[conversationId] = newMessagesByConversation[conversationId].map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          );
        });
        
        return { messagesByConversation: newMessagesByConversation };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update message'
      });
    }
  },

  deleteMessage: async (userId, messageId) => {
    try {
      await firebaseAIConversationService.deleteAIConversationMessage(userId, messageId);
      
      set(state => {
        const newMessagesByConversation = { ...state.messagesByConversation };
        Object.keys(newMessagesByConversation).forEach(conversationId => {
          newMessagesByConversation[conversationId] = newMessagesByConversation[conversationId].filter(
            msg => msg.id !== messageId
          );
        });
        
        return { messagesByConversation: newMessagesByConversation };
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete message'
      });
    }
  },

  // Utility functions
  getMessages: (conversationId) => {
    const { messagesByConversation } = get();
    return messagesByConversation[conversationId] || [];
  },

  clearMessages: (conversationId) => {
    set(state => {
      const newMessagesByConversation = { ...state.messagesByConversation };
      delete newMessagesByConversation[conversationId];
      return { messagesByConversation: newMessagesByConversation };
    });
  },

  reset: () => set({
    messagesByConversation: {},
    loading: false,
    error: null
  })
}));
