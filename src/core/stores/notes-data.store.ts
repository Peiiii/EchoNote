import { getRandomEmoji } from "@/common/utils/emoji";
import { create } from "zustand";
import { useNotesViewStore } from "./notes-view.store";
import { channelMessageService } from "@/core/services/channel-message.service";
import { getFeaturesConfig } from "@/core/config/features.config";
import { getStorageProvider } from "@/core/storage/provider";
import { getExistingGuestUserId, getOrCreateGuestUserId } from "@/core/services/guest-id";
import type { Cursor } from "@/core/storage/types";
import type { Message, Channel } from "@/core/types/notes";

export type { AIAnalysis, Message, Channel, ShareMode } from "@/core/types/notes";

// 新增：Channel级别的消息状态类型
export interface ChannelMessageState {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  lastVisible: Cursor | null;
}

export interface NotesDataState {
  channels: Channel[];
  channelsLoading: boolean;
  userId: string | null;
  unsubscribeChannels: (() => void) | null;
  isListenerEnabled: boolean;

  // Channel级别的消息管理
  messagesByChannel: Record<string, ChannelMessageState>;

  // Actions
  setChannelsLoading: (loading: boolean) => void;
  addChannel: (channel: Omit<Channel, "id" | "createdAt" | "messageCount">) => Promise<void>;
  updateChannel: (
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ) => Promise<void>;
  deleteChannel: (channelId: string) => Promise<void>;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  deleteMessage: (messageId: string, hardDelete?: boolean) => Promise<void>;
  updateMessage: (messageId: string, updates: Partial<Message>) => Promise<void>;
  moveMessage: (
    messageId: string,
    fromChannelId: string,
    toChannelId: string
  ) => Promise<void>;
  addThreadMessage: (
    parentMessageId: string,
    message: Omit<Message, "id" | "timestamp" | "parentId" | "threadId">
  ) => Promise<void>;
  restoreMessage: (messageId: string) => Promise<void>;
  permanentDeleteMessage: (messageId: string) => Promise<void>;

  // 新增：channel消息管理actions
  setChannelMessages: (channelId: string, messages: Message[]) => void;
  addChannelMessage: (channelId: string, message: Message) => void;
  setChannelLoading: (channelId: string, loading: boolean) => void;
  setChannelHasMore: (channelId: string, hasMore: boolean) => void;
  setChannelLastVisible: (channelId: string, lastVisible: Cursor | null) => void;
  clearChannelMessages: (channelId: string) => void;
  removeChannelMessage: (channelId: string, messageId: string) => void;

  // Firebase integration
  initFirebaseListeners: (userId: string) => Promise<void>;
  initGuestWorkspace: (options?: { autoCreateDefaultSpace?: boolean }) => Promise<void>;
  cleanupListeners: () => void;
  fetchInitialData: (userId: string) => Promise<void>;
  validateAndCleanupCurrentChannel: (channels: Channel[]) => void;

  // Space publishing
  publishSpace: (channelId: string, shareMode?: "read-only" | "append-only") => Promise<string>;
  unpublishSpace: (channelId: string) => Promise<void>;
  updatePublishMode: (channelId: string, shareMode: "read-only" | "append-only") => Promise<void>;
}

// Utility functions to reduce code duplication
const withUserValidation =
  <T extends unknown[]>(fn: (userId: string, ...args: T) => Promise<void>) =>
  async (...args: T): Promise<void> => {
    const { userId } = useNotesDataStore.getState();
    if (!userId) return;
    await fn(userId, ...args);
  };

const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T | void> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${operationName}:`, error);
  }
};

export const useNotesDataStore = create<NotesDataState>()((set, get) => ({
  channels: [],
  channelsLoading: true, // Start with loading state
  userId: null,
  unsubscribeChannels: null,
  isListenerEnabled: true,

  // Channel级别的消息管理
  messagesByChannel: {},

  setChannelsLoading: (loading: boolean) => {
    set({ channelsLoading: loading });
  },

  addChannel: withUserValidation(async (userId, channel) => {
    // Assign a random emoji if none provided
    const finalChannel = {
      ...channel,
      emoji: channel.emoji && channel.emoji.trim() ? channel.emoji : getRandomEmoji(),
    };
    const newId = await withErrorHandling(
      () => getStorageProvider().notes.createChannel(userId, finalChannel),
      "createChannel"
    );
    // Auto-select the newly created channel if available
    if (typeof newId === "string" && newId) {
      try {
        useNotesViewStore.getState().setCurrentChannel(newId);
        // Optimistically add the new channel to local store so UI updates immediately
        // This prevents a brief mismatch where header actions still reference the old channel
        // before Firestore subscription pushes the new channel doc.
        const optimisticChannel: Channel = {
          id: newId,
          name: finalChannel.name,
          description: finalChannel.description,
          emoji: finalChannel.emoji,
          createdAt: new Date(),
          updatedAt: new Date(),
          messageCount: 0,
          lastMessageTime: new Date(),
          backgroundColor: undefined,
          backgroundImage: undefined,
        };
        const { channels } = useNotesDataStore.getState();
        const exists = channels.some(c => c.id === newId);
        if (!exists) {
          useNotesDataStore.setState({ channels: [optimisticChannel, ...channels] });
        }
      } catch (err) {
        console.warn("[addChannel] Failed to set current channel after creation", err);
      }
    }
  }),

  updateChannel: withUserValidation(async (userId, channelId, updates) => {
    const { channels } = get();
    const updatedChannels = channels.map(channel =>
      channel.id === channelId ? { ...channel, ...updates } : channel
    );

    set({ channels: updatedChannels });

    await withErrorHandling(
      () => getStorageProvider().notes.updateChannel(userId, channelId, updates),
      "updateChannel"
    );
  }),

  deleteChannel: withUserValidation(async (userId, channelId) => {
    // 调用 Firebase 服务删除 channel
    await withErrorHandling(
      () => getStorageProvider().notes.deleteChannel(userId, channelId),
      "deleteChannel"
    );

    // 更新本地 store 状态
    const { channels, messagesByChannel } = get();

    // 从 channels 数组中移除被删除的 channel
    const updatedChannels = channels.filter(channel => channel.id !== channelId);
    set({ channels: updatedChannels });

    // 从 messagesByChannel 中移除被删除 channel 的消息
    const { [channelId]: removedChannel, ...remainingChannels } = messagesByChannel;
    set({ messagesByChannel: remainingChannels });

    console.log("🔔 [deleteChannel] 成功删除 channel 并更新本地状态", {
      channelId,
      remainingChannelsCount: Object.keys(remainingChannels).length,
      removedChannelMessageCount: removedChannel?.messages?.length || 0,
    });
  }),

  addMessage: withUserValidation(async (userId, message) => {
    await withErrorHandling(
      () => getStorageProvider().notes.createMessage(userId, message),
      "createMessage"
    );
  }),

  deleteMessage: withUserValidation(async (userId, messageId, hardDelete = false) => {
    await withErrorHandling(
      () => getStorageProvider().notes.deleteMessage(userId, messageId, { hardDelete }),
      hardDelete ? "deleteMessage" : "softDeleteMessage"
    );

    // 更新本地store状态 - 修复逻辑：遍历所有channel找到包含该消息的channel
    const { messagesByChannel } = get();
    console.log("🔔 [deleteMessage] 开始查找消息", { messageId, messagesByChannel });

    for (const [channelId, channelState] of Object.entries(messagesByChannel)) {
      const messageExists = channelState.messages.some(msg => msg.id === messageId);
      if (messageExists) {
        console.log("🔔 [deleteMessage] 找到消息，准备删除", { channelId, messageId });
        get().removeChannelMessage(channelId, messageId);
        break; // 找到后立即退出循环
      }
    }
  }),

  updateMessage: withUserValidation(async (userId, messageId, updates) => {
    await withErrorHandling(
      () => getStorageProvider().notes.updateMessage(userId, messageId, updates),
      "updateMessage"
    );
  }),

  moveMessage: withUserValidation(async (userId, messageId, fromChannelId, toChannelId) => {
    try {
      await getStorageProvider().notes.moveMessage(userId, messageId, fromChannelId, toChannelId);
    } catch (error) {
      console.error("Failed to move message:", { messageId, fromChannelId, toChannelId, error });
      throw error;
    }

    set(state => {
      const sourceChannel = state.messagesByChannel[fromChannelId];
      const targetChannel = state.messagesByChannel[toChannelId];
      if (!sourceChannel) {
        return state;
      }

      const messageToMove = sourceChannel.messages.find(msg => msg.id === messageId);
      if (!messageToMove) {
        return state;
      }

      const updatedSourceChannel = {
        ...sourceChannel,
        messages: sourceChannel.messages.filter(msg => msg.id !== messageId),
      };

      let updatedMessagesByChannel: Record<string, ChannelMessageState> = {
        ...state.messagesByChannel,
        [fromChannelId]: updatedSourceChannel,
      };

      if (targetChannel) {
        const updatedMessage = { ...messageToMove, channelId: toChannelId };
        const mergedMessages = [...targetChannel.messages.filter(msg => msg.id !== messageId), updatedMessage].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
        updatedMessagesByChannel = {
          ...updatedMessagesByChannel,
          [toChannelId]: {
            ...targetChannel,
            messages: mergedMessages,
          },
        };
      }

      return {
        messagesByChannel: updatedMessagesByChannel,
      };
    });
  }),

  addThreadMessage: withUserValidation(async (userId, parentMessageId, message) => {
    await withErrorHandling(
      () =>
        getStorageProvider().notes.createMessage(userId, {
          ...message,
          parentId: parentMessageId,
          threadId: parentMessageId,
        }),
      "createThreadMessage"
    );
  }),

  restoreMessage: withUserValidation(async (userId, messageId) => {
    await withErrorHandling(
      () => getStorageProvider().notes.restoreMessage(userId, messageId),
      "restoreMessage"
    );
  }),

  permanentDeleteMessage: withUserValidation(async (userId, messageId) => {
    await withErrorHandling(
      () => getStorageProvider().notes.deleteMessage(userId, messageId, { hardDelete: true }),
      "permanentDeleteMessage"
    );
  }),

  // 新增：channel消息管理actions
  setChannelMessages: (channelId: string, messages: Message[]) => {
    set(state => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: {
          ...state.messagesByChannel[channelId],
          messages,
          loading: false,
        },
      },
    }));
  },

  addChannelMessage: (channelId: string, message: Message) => {
    set(state => {
      const currentChannel = state.messagesByChannel[channelId];
      if (!currentChannel) return state;

      // ✅ 新增：检查消息是否已存在，防止重复添加
      const messageExists = currentChannel.messages.some(msg => msg.id === message.id);
      if (messageExists) {
        console.log("🔔 [addChannelMessage] 消息已存在，跳过添加", {
          messageId: message.id,
          channelId,
        });
        return state; // 消息已存在，不重复添加
      }

      console.log("🔔 [addChannelMessage] 添加新消息", { messageId: message.id, channelId });

      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: {
            ...currentChannel,
            messages: [...currentChannel.messages, message],
          },
        },
      };
    });
  },

  setChannelLoading: (channelId: string, loading: boolean) => {
    set(state => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: {
          ...state.messagesByChannel[channelId],
          loading,
        },
      },
    }));
  },

  setChannelHasMore: (channelId: string, hasMore: boolean) => {
    set(state => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: {
          ...state.messagesByChannel[channelId],
          hasMore,
        },
      },
    }));
  },

  setChannelLastVisible: (channelId: string, lastVisible: Cursor | null) => {
    set(state => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: {
          ...state.messagesByChannel[channelId],
          lastVisible,
        },
      },
    }));
  },

  clearChannelMessages: (channelId: string) => {
    set(state => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [channelId]: removed, ...rest } = state.messagesByChannel;
      return { messagesByChannel: rest };
    });
  },

  // 新增：从特定channel中删除消息
  removeChannelMessage: (channelId: string, messageId: string) => {
    set(state => {
      const currentChannel = state.messagesByChannel[channelId];
      if (!currentChannel) return state;

      const updatedMessages = currentChannel.messages.filter(msg => msg.id !== messageId);

      console.log("🔔 [removeChannelMessage]", {
        channelId,
        messageId,
        beforeCount: currentChannel.messages.length,
        afterCount: updatedMessages.length,
      });

      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: {
            ...currentChannel,
            messages: updatedMessages,
          },
        },
      };
    });
  },

  initFirebaseListeners: async (userId: string) => {
    const { userId: currentUserId, unsubscribeChannels: existingUnsub } = get();
    // Guard: if already initialized for this user, skip duplicate init to avoid flicker
    if (existingUnsub && currentUserId === userId) {
      return;
    }

    get().cleanupListeners();
    set({ userId, channelsLoading: true });

    const featuresConfig = getFeaturesConfig();
    const migrationsEnabled = featuresConfig.data?.migrations?.enabled !== false;

    // Run backend initialization (e.g., migrations) in the background so the first channels snapshot
    // is not blocked by network round-trips.
    if (migrationsEnabled) {
      void getStorageProvider()
        .initializeForUser(userId)
        .catch(error => {
          console.warn("[notes] initializeForUser failed (non-blocking)", { userId, error });
        });
    }

    const notesRepo = getStorageProvider().notes;
    if (!notesRepo.subscribeChannels) {
      throw new Error("Current storage backend does not support realtime channel subscriptions");
    }
    const unsubscribeChannels = notesRepo.subscribeChannels(userId, channels => {
      const { isListenerEnabled } = get();
      if (!isListenerEnabled) return;
      set({ channels, channelsLoading: false });

      get().validateAndCleanupCurrentChannel(channels);
    });

    set({ unsubscribeChannels });
  },

  initGuestWorkspace: async (options?: { autoCreateDefaultSpace?: boolean }) => {
    const existedGuestId = getExistingGuestUserId();
    const guestUserId = getOrCreateGuestUserId();
    await get().initFirebaseListeners(guestUserId);

    // If the user explicitly chose the local experience and this is their first guest workspace,
    // create a default space so they can start immediately without extra clicks.
    // (We still verify storage to avoid duplicates if init is triggered twice.)
    const shouldAutoCreate = !!options?.autoCreateDefaultSpace && !existedGuestId;
    if (shouldAutoCreate) {
      try {
        const existingChannels = await getStorageProvider().notes.listChannels(guestUserId);
        if (existingChannels.length === 0) {
          await get().addChannel({
            name: "My First Space",
            emoji: "🚀",
            description: "Start your journey here",
          });
        }
      } catch (error) {
        console.warn("[guest] failed to auto-create default space", error);
      }
    }
  },

  cleanupListeners: () => {
    const { unsubscribeChannels } = get();
    if (unsubscribeChannels) {
      unsubscribeChannels();
    }
    set({
      unsubscribeChannels: null,
      channels: [],
      channelsLoading: false,
      userId: null,
      messagesByChannel: {}, // Clear channel messages when cleaning up
    });
  },

  fetchInitialData: async (userId: string) => {
    set({ channelsLoading: true });
    await withErrorHandling(async () => {
      const channels = await getStorageProvider().notes.listChannels(userId);
      set({ channels, channelsLoading: false });

      get().validateAndCleanupCurrentChannel(channels);
    }, "fetchChannels");
  },

  validateAndCleanupCurrentChannel: (channels: Channel[]) => {
    const currentChannelId = useNotesViewStore.getState().currentChannelId;

    if (!currentChannelId) return;

    const channelExists = channels.some(channel => channel.id === currentChannelId);

    if (!channelExists) {
      useNotesViewStore.getState().setCurrentChannel(null);

      const channelStateControl = channelMessageService.getChannelStateControl(currentChannelId);
      channelStateControl.clearChannel();

      get().clearChannelMessages(currentChannelId);
    }
  },

  publishSpace: async (channelId: string, shareMode: "read-only" | "append-only" = "read-only"): Promise<string> => {
    const { userId } = get();
    if (!userId) return "";
    const shareToken = await withErrorHandling(
      () => getStorageProvider().notes.publishSpace(userId, channelId, shareMode),
      "publishSpace"
    );
    if (shareToken) {
      const { channels } = get();
      const updatedChannels = channels.map(channel =>
        channel.id === channelId ? { ...channel, shareToken, shareMode } : channel
      );
      set({ channels: updatedChannels });
    }
    return shareToken || "";
  },

  unpublishSpace: withUserValidation(async (userId, channelId) => {
    await withErrorHandling(
      () => getStorageProvider().notes.unpublishSpace(userId, channelId),
      "unpublishSpace"
    );
    const { channels } = get();
    const updatedChannels = channels.map(channel =>
      channel.id === channelId ? { ...channel, shareToken: undefined, shareMode: undefined } : channel
    );
    set({ channels: updatedChannels });
  }),

  updatePublishMode: withUserValidation(async (userId, channelId, shareMode) => {
    await withErrorHandling(
      () => getStorageProvider().notes.updateChannel(userId, channelId, { shareMode }),
      "updatePublishMode"
    );
    const { channels } = get();
    const updatedChannels = channels.map(channel =>
      channel.id === channelId ? { ...channel, shareMode } : channel
    );
    set({ channels: updatedChannels });
  }),
}));
