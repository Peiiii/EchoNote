import { firebaseChatService } from "@/common/services/firebase/firebase-chat.service";
import { firebaseMigrateService } from "@/common/services/firebase/firebase-migrate.service";
import { create } from "zustand";

export interface AIAnalysis {
  keywords: string[];
  topics: string[];
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  tags: string[];
  insights: string[];
  relatedTopics: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  channelId: string;
  tags?: string[];
  parentId?: string;
  threadId?: string;
  isThreadExpanded?: boolean;
  threadCount?: number;
  aiAnalysis?: AIAnalysis;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  canRestore?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  messageCount: number;
  lastMessageTime?: Date;
}

export interface ChatDataState {
  channels: Channel[];
  messages: Message[]; // Keep for backward compatibility
  userId: string | null;
  unsubscribeChannels: (() => void) | null;
  isListenerEnabled: boolean;

  // Actions
  addChannel: (channel: Omit<Channel, "id" | "createdAt" | "messageCount">) => Promise<void>;
  updateChannel: (channelId: string, updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  deleteMessage: (messageId: string, hardDelete?: boolean) => Promise<void>;
  updateMessage: (messageId: string, updates: Partial<Message>) => Promise<void>;
  addThreadMessage: (parentMessageId: string, message: Omit<Message, "id" | "timestamp" | "parentId" | "threadId">) => Promise<void>;
  restoreMessage: (messageId: string) => Promise<void>;
  permanentDeleteMessage: (messageId: string) => Promise<void>;

  // Firebase integration
  initFirebaseListeners: (userId: string) => Promise<void>;
  cleanupListeners: () => void;
  fetchInitialData: (userId: string) => Promise<void>;
}

// Utility functions to reduce code duplication
const withUserValidation = <T extends unknown[]>(fn: (userId: string, ...args: T) => Promise<void>) => 
  async (...args: T): Promise<void> => {
    const { userId } = useChatDataStore.getState();
    if (!userId) return;
    await fn(userId, ...args);
  };

const withErrorHandling = async <T>(operation: () => Promise<T>, operationName: string): Promise<T | void> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${operationName}:`, error);
  }
};

export const useChatDataStore = create<ChatDataState>()((set, get) => ({
  channels: [],
  messages: [], // Keep for backward compatibility
  userId: null,
  unsubscribeChannels: null,
  isListenerEnabled: true,

  addChannel: withUserValidation(async (userId, channel) => {
    await withErrorHandling(
      () => firebaseChatService.createChannel(userId, channel),
      'createChannel'
    );
  }),

  updateChannel: withUserValidation(async (userId, channelId, updates) => {
    const { channels } = get();
    const updatedChannels = channels.map((channel) =>
      channel.id === channelId ? { ...channel, ...updates } : channel
    );
    
    set({ channels: updatedChannels });
    
    await withErrorHandling(
      () => firebaseChatService.updateChannel(userId, channelId, updates),
      'updateChannel'
    );
  }),

  addMessage: withUserValidation(async (userId, message) => {
    await withErrorHandling(
      () => firebaseChatService.createMessage(userId, message),
      'createMessage'
    );
  }),

  deleteMessage: withUserValidation(async (userId, messageId, hardDelete = false) => {
    const operation = hardDelete 
      ? () => firebaseChatService.deleteMessage(userId, messageId)
      : () => firebaseChatService.softDeleteMessage(userId, messageId);
    
    await withErrorHandling(operation, hardDelete ? 'deleteMessage' : 'softDeleteMessage');
  }),

  updateMessage: withUserValidation(async (userId, messageId, updates) => {
    await withErrorHandling(
      () => firebaseChatService.updateMessage(userId, messageId, updates),
      'updateMessage'
    );
  }),

  addThreadMessage: withUserValidation(async (userId, parentMessageId, message) => {
    await withErrorHandling(
      () => firebaseChatService.createMessage(userId, {
        ...message,
        parentId: parentMessageId,
        threadId: parentMessageId,
      }),
      'createThreadMessage'
    );
  }),

  restoreMessage: withUserValidation(async (userId, messageId) => {
    await withErrorHandling(
      () => firebaseChatService.restoreMessage(userId, messageId),
      'restoreMessage'
    );
  }),

  permanentDeleteMessage: withUserValidation(async (userId, messageId) => {
    await withErrorHandling(
      () => firebaseChatService.deleteMessage(userId, messageId),
      'permanentDeleteMessage'
    );
  }),

  initFirebaseListeners: async (userId: string) => {
    get().cleanupListeners();
    set({ userId });

    await get().fetchInitialData(userId);

    await withErrorHandling(async () => {
      await firebaseMigrateService.runAllMigrations(userId);
    }, 'runMigrations');

    const unsubscribeChannels = firebaseChatService.subscribeToChannels(
      userId,
      (channels) => {
        const { isListenerEnabled } = get();
        if (!isListenerEnabled) return;
        set({ channels });
      }
    );

    set({ unsubscribeChannels });
  },

  cleanupListeners: () => {
    const { unsubscribeChannels } = get();
    if (unsubscribeChannels) {
      unsubscribeChannels();
    }
    set({
      unsubscribeChannels: null,
      channels: [],
      userId: null,
    });
  },

  fetchInitialData: async (userId: string) => {
    await withErrorHandling(async () => {
      const channels = await firebaseChatService.fetchChannels(userId);
      set({ channels });
    }, 'fetchChannels');
  },
}));




