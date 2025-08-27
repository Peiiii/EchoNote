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
  parentId?: string; // Parent message ID for creating threads
  threadId?: string; // Thread ID, messages in the same thread share this ID
  isThreadExpanded?: boolean; // Whether the thread is expanded
  threadCount?: number; // Number of messages in the thread
  aiAnalysis?: AIAnalysis; // AI analysis results
  // 删除相关字段
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
  lastMessageTime?: Date; // 最后消息时间，用于排序
}

export interface ChatDataState {
  // Data state
  channels: Channel[];
  messages: Message[];
  userId: string | null;

  // Firebase unsubscribe functions
  unsubscribeChannels: (() => void) | null;

  // 监听器状态控制
  isListenerEnabled: boolean;

  // Data actions
  addChannel: (
    channel: Omit<Channel, "id" | "createdAt" | "messageCount">
  ) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  updateChannel: (
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ) => Promise<void>;
  deleteMessage: (messageId: string, hardDelete?: boolean) => Promise<void>;
  updateMessage: (
    messageId: string,
    updates: Partial<Message>
  ) => Promise<void>;

  // Thread related actions
  addThreadMessage: (
    parentMessageId: string,
    message: Omit<Message, "id" | "timestamp" | "parentId" | "threadId">
  ) => Promise<void>;
  getThreadMessages: (threadId: string) => Message[];

  // 删除相关方法
  restoreMessage: (messageId: string) => Promise<void>;
  getDeletedMessages: () => Message[];
  permanentDeleteMessage: (messageId: string) => Promise<void>;

  // Firebase integration methods
  initFirebaseListeners: (userId: string) => Promise<void>;
  cleanupListeners: () => void;

  // 初始化加载方法
  fetchInitialData: (userId: string) => Promise<void>;
}

export const useChatDataStore = create<ChatDataState>()((set, get) => ({
  // Initial data state
  channels: [],
  messages: [],
  userId: null,
  unsubscribeChannels: null,
  isListenerEnabled: true,

  // Data actions with Firebase integration
  addChannel: async (channel) => {
    const { userId } = get();
    if (!userId) return;

    try {
      await firebaseChatService.createChannel(userId, channel);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  },

  updateChannel: async (channelId, updates) => {
    const { userId, channels } = get();
    if (!userId) return;

    try {
      set({
        channels: channels.map((channel) =>
          channel.id === channelId ? { ...channel, ...updates } : channel
        ),
      });

      await firebaseChatService.updateChannel(userId, channelId, updates);
    } catch (error) {
      console.error("Error updating channel:", error);
      set({ channels });
    }
  },

  addMessage: async (message) => {
    const { userId } = get();
    if (!userId) return;

    try {
      // Call Firebase service to create message
      await firebaseChatService.createMessage(
        userId,
        message
      );

      // Message will be automatically added to the channel via subscription
      // No need to manually update local state

    } catch (error) {
      console.error("Error creating message:", error);
    }
  },

  deleteMessage: async (messageId, hardDelete = false) => {
    const { userId } = get();
    if (!userId) return;

    try {
      if (hardDelete) {
        // Hard delete: remove from Firebase
        await firebaseChatService.deleteMessage(userId, messageId);
        // Message will be automatically removed via subscription
      } else {
        // Soft delete: mark as deleted state
        await firebaseChatService.softDeleteMessage(userId, messageId);
        // Message state will be automatically updated via subscription
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  },

  updateMessage: async (messageId, updates) => {
    const { userId } = get();
    if (!userId) return;

    try {
      // Call Firebase service to update message
      await firebaseChatService.updateMessage(userId, messageId, updates);
      // Message will be automatically updated via subscription
    } catch (error) {
      console.error("Error updating message:", error);
    }
  },

  // Thread related actions
  addThreadMessage: async (parentMessageId, message) => {
    const { userId } = get();
    if (!userId) return;

    try {
      // Call Firebase service to create thread message
      await firebaseChatService.createMessage(userId, {
        ...message,
        parentId: parentMessageId,
        threadId: parentMessageId, // Use parentMessageId as threadId
      });
      // Thread message will be automatically added via subscription
    } catch (error) {
      console.error("Error creating thread message:", error);
    }
  },

  getThreadMessages: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _threadId: string
  ): Message[] => {
    // This method is no longer needed as thread messages are handled per-channel
    // Return empty array - thread messages are now managed by useChannelMessages
    return [];
  },

  // Firebase integration methods
  initFirebaseListeners: async (userId: string) => {
    // Clean up existing listeners if any
    get().cleanupListeners();

    // Set user ID
    set({ userId });

    // First load initial data
    await get().fetchInitialData(userId);

    // Migrate existing data to ensure data model consistency
    try {
      await firebaseMigrateService.runAllMigrations(userId);
    } catch (error) {
      console.error('Error during migrations:', error);
    }

    // Subscribe to channels only (messages are now handled per-channel)
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
      messages: [], // Clear messages when cleaning up
      userId: null,
    });
  },

  // Delete related methods
  restoreMessage: async (messageId) => {
    const { userId } = get();
    if (!userId) return;

    try {
      // Call Firebase service to restore message
      await firebaseChatService.restoreMessage(userId, messageId);
      // Message will be automatically updated via subscription
    } catch (error) {
      console.error("Error restoring message:", error);
    }
  },

  getDeletedMessages: () => {
    // This method is no longer needed as messages are handled per-channel
    // Return empty array - deleted messages are now managed by useChannelMessages
    return [];
  },

  permanentDeleteMessage: async (messageId) => {
    const { userId } = get();
    if (!userId) return;

    try {
      // Call Firebase service to delete message
      await firebaseChatService.deleteMessage(userId, messageId);
      // Message will be automatically removed via subscription
    } catch (error) {
      console.error("Error permanently deleting message:", error);
    }
  },

  // Initialize loading data
  fetchInitialData: async (userId: string) => {
    try {

      // Only load channels - messages are now loaded per-channel via subscriptions
      const channels = await firebaseChatService.fetchChannels(userId);
      set({ channels });

      // Messages are no longer loaded globally - they are loaded per-channel
      // when the user navigates to a specific channel

    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  },
}));
