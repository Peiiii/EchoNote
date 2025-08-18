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
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  messageCount: number;
}

export interface ChatDataState {
  // Data state
  channels: Channel[];
  messages: Message[];
  userId: string | null;

  // Firebase unsubscribe functions
  unsubscribeChannels: (() => void) | null;
  unsubscribeMessages: (() => void) | null;

  // Data actions
  addChannel: (
    channel: Omit<Channel, "id" | "createdAt" | "messageCount">
  ) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
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

  // Firebase integration methods
  initFirebaseListeners: (userId: string) => void;
  cleanupListeners: () => void;
}

export const useChatDataStore = create<ChatDataState>()((set, get) => ({
  // Initial data state
  channels: [],
  messages: [],
  userId: null,
  unsubscribeChannels: null,
  unsubscribeMessages: null,

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

  deleteMessage: async (messageId) => {
    const { userId } = get();
    if (!userId) return;

    try {
      await firebaseChatService.deleteMessage(userId, messageId);
    } catch (error) {
      console.error("Error deleting message:", error);
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
  initFirebaseListeners: (userId: string) => {
    // Clean up existing listeners if any
    get().cleanupListeners();

    // Set user ID
    set({ userId });

    // Subscribe to channels
    const unsubscribeChannels = firebaseChatService.subscribeToChannels(
      userId,
      (channels) => {
        set({ channels });
      }
    );

    // Subscribe to messages for all channels
    const unsubscribeMessages = firebaseChatService.subscribeToMessages(
      userId,
      (messages) => {
        set({ messages });
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
}));
