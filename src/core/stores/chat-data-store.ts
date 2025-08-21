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

  addMessage: async (message) => {
    const { userId, messages } = get();
    if (!userId) return;

    // 生成临时ID和时间戳
    const tempId = `temp_${Date.now()}`;
    const tempMessage: Message = {
      ...message,
      id: tempId,
      timestamp: new Date(),
    } as Message;

    // 乐观更新：立即添加消息到状态中（添加到末尾，显示在底部）
    set({ messages: [...messages, tempMessage] });

    try {
      // 调用Firebase服务创建消息
      const messageId = await firebaseChatService.createMessage(
        userId,
        message
      );

      // 用服务器返回的真实ID更新消息
      const currentMessages = get().messages;
      set({
        messages: currentMessages.map((msg) =>
          msg.id === tempId ? { ...tempMessage, id: messageId } : msg
        ),
      });
    } catch (error) {
      console.error("Error creating message:", error);
      // 如果失败，移除临时消息
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
      // 暂时禁用监听器，避免冲突
      set({ isListenerEnabled: false });
      
      if (hardDelete) {
        // 硬删除：直接从Firebase和本地状态中移除
        await firebaseChatService.deleteMessage(userId, messageId);
        set({ messages: messages.filter(msg => msg.id !== messageId) });
      } else {
        // 软删除：标记为已删除状态
        await firebaseChatService.softDeleteMessage(userId, messageId);
        // 乐观更新：标记消息为已删除
        const updatedMessages = messages.map(msg =>
          msg.id === messageId
            ? { ...msg, isDeleted: true, deletedAt: new Date(), deletedBy: userId }
            : msg
        );
        set({ messages: updatedMessages });
      }
      
      // 延迟重新启用监听器，确保Firebase操作完成
      setTimeout(() => {
        set({ isListenerEnabled: true });
      }, 1000);
      
    } catch (error) {
      console.error("Error deleting message:", error);
      // 如果删除失败，重新启用监听器
      set({ isListenerEnabled: true });
    }
  },

  updateMessage: async (messageId, updates) => {
    const { userId, messages } = get();
    if (!userId) return;

    // 乐观更新：立即应用更新到状态中
    set({
      messages: messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    });

    try {
      // 调用Firebase服务更新消息
      await firebaseChatService.updateMessage(userId, messageId, updates);
    } catch (error) {
      console.error("Error updating message:", error);
      // 如果失败，恢复原始消息
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

    // 生成临时ID和时间戳
    const tempId = `temp_${Date.now()}`;
    const tempMessage: Message = {
      ...messageWithThread,
      id: tempId,
      timestamp: new Date(),
    } as Message;

    // 乐观更新：立即添加消息到状态中（添加到末尾，显示在底部）
    set({ messages: [...messages, tempMessage] });

    try {
      // 调用Firebase服务创建消息
      const messageId = await firebaseChatService.createMessage(
        userId,
        messageWithThread
      );

      // 用服务器返回的真实ID更新消息
      const currentMessages = get().messages;
      set({
        messages: currentMessages.map((msg) =>
          msg.id === tempId ? { ...tempMessage, id: messageId } : msg
        ),
      });
    } catch (error) {
      console.error("Error creating thread message:", error);
      // 如果失败，移除临时消息
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

    // 先加载初始数据
    await get().fetchInitialData(userId);
    
    // 迁移现有频道数据（如果需要）
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
        // 过滤掉已删除的消息，避免状态更新问题
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

  // 删除相关方法
  restoreMessage: async (messageId) => {
    const { userId, messages } = get();
    if (!userId) return;

    try {
      // 暂时禁用监听器，避免冲突
      set({ isListenerEnabled: false });
      
      await firebaseChatService.restoreMessage(userId, messageId);
      // 乐观更新：恢复消息状态
      set({
        messages: messages.map(msg =>
          msg.id === messageId
            ? { ...msg, isDeleted: false, deletedAt: undefined, deletedBy: undefined }
            : msg
        ),
      });
      
      // 延迟重新启用监听器
      setTimeout(() => {
        set({ isListenerEnabled: true });
      }, 1000);
      
    } catch (error) {
      console.error("Error restoring message:", error);
      // 如果恢复失败，重新启用监听器
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
      // 暂时禁用监听器，避免冲突
      set({ isListenerEnabled: false });
      
      await firebaseChatService.deleteMessage(userId, messageId);
      // 从本地状态中永久移除
      set({ messages: messages.filter(msg => msg.id !== messageId) });
      
      // 延迟重新启用监听器
      setTimeout(() => {
        set({ isListenerEnabled: true });
      }, 1000);
      
    } catch (error) {
      console.error("Error permanently deleting message:", error);
      // 如果删除失败，重新启用监听器
      set({ isListenerEnabled: true });
    }
  },

  // 初始化加载数据
  fetchInitialData: async (userId: string) => {
    try {
      console.log('Fetching initial data for user:', userId);

      // 1. 首先获取频道列表
      const channels = await firebaseChatService.fetchChannels(userId);
      console.log('Initial channels loaded:', channels.length);
      set({ channels });

      // 2. 获取所有消息（不分频道，因为 subscribeToMessages 也是这样做的）
      const messages = await firebaseChatService.fetchAllMessages(userId);
      console.log('Initial messages loaded:', messages.length);

      // 过滤掉已删除的消息
      const activeMessages = messages.filter(msg => !msg.isDeleted);
      set({ messages: activeMessages });

    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  },
}));
