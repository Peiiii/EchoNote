import { firebaseChatService } from "@/common/services/firebase/firebase-chat.service";
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
  unsubscribeMessages: (() => void) | null;

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
  unsubscribeMessages: null,
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
    const { userId, messages } = get();
    if (!userId) return;

    // Generate a temporary ID and timestamp
    const tempId = `temp_${Date.now()}`;
    const tempMessage: Message = {
      ...message,
      id: tempId,
      timestamp: new Date(),
    } as Message;

    // Optimistic update: immediately add the message to the state (append to the end, display at the bottom)
    set({ messages: [...messages, tempMessage] });

    try {
      // Call Firebase service to create message
      const messageId = await firebaseChatService.createMessage(
        userId,
        message
      );

      // Update message with the server-generated ID
      const currentMessages = get().messages;
      set({
        messages: currentMessages.map((msg) =>
          msg.id === tempId ? { ...tempMessage, id: messageId } : msg
        ),
      });
    } catch (error) {
      console.error("Error creating message:", error);
      // If failed, remove the temporary message
      const currentMessages = get().messages;
      set({
        messages: currentMessages.filter((msg) => msg.id !== tempId),
      });
    }
  },

  deleteMessage: async (messageId, hardDelete = false) => {
    const { userId, messages } = get();
    if (!userId) return;

    try {
      // Temporarily disable listeners to avoid conflicts
      set({ isListenerEnabled: false });

      if (hardDelete) {
        // Hard delete: remove from Firebase and local state
        await firebaseChatService.deleteMessage(userId, messageId);
        set({ messages: messages.filter(msg => msg.id !== messageId) });
      } else {
        // Soft delete: mark as deleted state
        await firebaseChatService.softDeleteMessage(userId, messageId);
        // Optimistic update: mark message as deleted
        const updatedMessages = messages.map(msg =>
          msg.id === messageId
            ? { ...msg, isDeleted: true, deletedAt: new Date(), deletedBy: userId }
            : msg
        );
        set({ messages: updatedMessages });
      }

      // Delay re-enabling listeners to ensure Firebase operations complete
      setTimeout(() => {
        set({ isListenerEnabled: true });
      }, 1000);

    } catch (error) {
      console.error("Error deleting message:", error);
      // If deletion fails, re-enable listeners
      set({ isListenerEnabled: true });
    }
  },

  updateMessage: async (messageId, updates) => {
    const { userId, messages } = get();
    if (!userId) return;

    // Optimistic update: immediately apply updates to the state
    set({
      messages: messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    });

    try {
      // Call Firebase service to update message
      await firebaseChatService.updateMessage(userId, messageId, updates);
    } catch (error) {
      console.error("Error updating message:", error);
      // If failed, restore original message
      set({ messages });
    }
  },

  // Thread related actions
  addThreadMessage: async (parentMessageId, message) => {
    const { userId, messages } = get();
    if (!userId) return;

    const parentMessage = messages.find(
      (msg: Message) => msg.id === parentMessageId
    );
    if (!parentMessage) return;

    const threadId = parentMessage.threadId || parentMessageId;
    const messageWithThread: Omit<Message, "id" | "timestamp"> = {
      ...message,
      parentId: parentMessageId,
      threadId: threadId,
      channelId: message.channelId,
    };

    // Generate temporary ID and timestamp
    const tempId = `temp_${Date.now()}`;
    const tempMessage: Message = {
      ...messageWithThread,
      id: tempId,
      timestamp: new Date(),
    } as Message;

    // Optimistic update: immediately add message to the state (append to the end, display at the bottom)
    set({ messages: [...messages, tempMessage] });

    try {
      // Call Firebase service to create message
      const messageId = await firebaseChatService.createMessage(
        userId,
        messageWithThread
      );

      // Update message with the server-generated ID
      const currentMessages = get().messages;
      set({
        messages: currentMessages.map((msg) =>
          msg.id === tempId ? { ...tempMessage, id: messageId } : msg
        ),
      });
    } catch (error) {
      console.error("Error creating thread message:", error);
      // If failed, remove the temporary message
      const currentMessages = get().messages;
      set({
        messages: currentMessages.filter((msg) => msg.id !== tempId),
      });
    }
  },

  getThreadMessages: (threadId: string): Message[] => {
    const { messages } = get();
    return messages
      .filter((msg) => msg.threadId === threadId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },

  // Firebase integration methods
  initFirebaseListeners: async (userId: string) => {
    // Clean up existing listeners if any
    get().cleanupListeners();

    // Set user ID
    set({ userId });

    // First load initial data
    await get().fetchInitialData(userId);

    // Migrate existing channels data (if needed)
    try {
      await firebaseChatService.migrateExistingChannels(userId);
    } catch (error) {
      console.error('Error during channel migration:', error);
    }

    // Subscribe to channels
    const unsubscribeChannels = firebaseChatService.subscribeToChannels(
      userId,
      (channels) => {
        const { isListenerEnabled } = get();
        if (!isListenerEnabled) return;

        console.log('Channels updated via subscription:', channels.length);
        set({ channels });
      }
    );

    // Subscribe to messages for all channels
    const unsubscribeMessages = firebaseChatService.subscribeToMessages(
      userId,
      (messages) => {
        const { isListenerEnabled } = get();
        if (!isListenerEnabled) return;

        console.log('Messages updated via subscription:', messages.length);
        // Filter out deleted messages to avoid state update issues
        const activeMessages = messages.filter(msg => !msg.isDeleted);
        set({ messages: activeMessages });
      }
    );

    set({ unsubscribeChannels, unsubscribeMessages });
  },

  cleanupListeners: () => {
    const { unsubscribeChannels, unsubscribeMessages } = get();
    if (unsubscribeChannels) {
      unsubscribeChannels();
    }
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
    set({
      unsubscribeChannels: null,
      unsubscribeMessages: null,
      channels: [],
      messages: [],
      userId: null,
    });
  },

  // Delete related methods
  restoreMessage: async (messageId) => {
    const { userId, messages } = get();
    if (!userId) return;

    try {
      // Temporarily disable listeners to avoid conflicts
      set({ isListenerEnabled: false });

      // Call Firebase service to restore message
      await firebaseChatService.restoreMessage(userId, messageId);
      // Optimistic update: restore message state
      set({
        messages: messages.map(msg =>
          msg.id === messageId
            ? { ...msg, isDeleted: false, deletedAt: undefined, deletedBy: undefined }
            : msg
        ),
      });

      // Delay re-enabling listeners
      setTimeout(() => {
        set({ isListenerEnabled: true });
      }, 1000);

    } catch (error) {
      console.error("Error restoring message:", error);
      // If restoration fails, re-enable listeners
      set({ isListenerEnabled: true });
    }
  },

  getDeletedMessages: () => {
    const { messages } = get();
    return messages.filter(msg => msg.isDeleted);
  },

  permanentDeleteMessage: async (messageId) => {
    const { userId, messages } = get();
    if (!userId) return;

    try {
      // Temporarily disable listeners to avoid conflicts
      set({ isListenerEnabled: false });

      // Call Firebase service to delete message
      await firebaseChatService.deleteMessage(userId, messageId);
      // Remove from local state permanently
      set({ messages: messages.filter(msg => msg.id !== messageId) });

      // Delay re-enabling listeners
      setTimeout(() => {
        set({ isListenerEnabled: true });
      }, 1000);

    } catch (error) {
      console.error("Error permanently deleting message:", error);
      // If deletion fails, re-enable listeners
      set({ isListenerEnabled: true });
    }
  },

  // Initialize loading data
  fetchInitialData: async (userId: string) => {
    try {
      console.log('Fetching initial data for user:', userId);

      // 1. First get channel list
      const channels = await firebaseChatService.fetchChannels(userId);
      console.log('Initial channels loaded:', channels.length);
      set({ channels });

      // 2. Get all messages (not by channel, because subscribeToMessages also does this)
      const messages = await firebaseChatService.fetchAllMessages(userId);
      console.log('Initial messages loaded:', messages.length);

      // Filter out deleted messages
      const activeMessages = messages.filter(msg => !msg.isDeleted);
      set({ messages: activeMessages });

    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  },
}));
