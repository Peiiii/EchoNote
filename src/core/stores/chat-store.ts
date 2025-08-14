import { githubSyncService } from "@/common/services/github-sync.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AIAnalysis {
    keywords: string[];
    topics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
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
    parentId?: string; // 父消息ID，用于创建thread
    threadId?: string; // thread ID，同一thread的消息共享此ID
    isThreadExpanded?: boolean; // 是否展开thread
    threadCount?: number; // thread中的消息数量
    aiAnalysis?: AIAnalysis; // AI分析结果
}

export interface Channel {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    messageCount: number;
}

export interface ChatState {
    // Channel related
    channels: Channel[];
    currentChannelId: string | null;

    // Message related
    messages: Message[];

    // User related
    userId: string;

    // GitHub sync related
    isGitHubEnabled: boolean;
    syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
    lastSyncTime: string | null;
    syncError: string | null;

    // Actions
    addChannel: (channel: Omit<Channel, "id" | "createdAt" | "messageCount">) => void;
    setCurrentChannel: (channelId: string) => void;
    addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
    deleteMessage: (messageId: string) => void;
    updateMessage: (messageId: string, updates: Partial<Message>) => void;

    // Thread related actions
    addThreadMessage: (parentMessageId: string, message: Omit<Message, "id" | "timestamp" | "parentId" | "threadId">) => void;
    toggleThreadExpansion: (messageId: string) => void;
    getThreadMessages: (threadId: string) => Message[];

    // GitHub sync actions
    enableGitHubSync: () => void;
    disableGitHubSync: () => void;
    syncToGitHub: () => Promise<void>;
    loadFromGitHub: () => Promise<void>;
    setSyncStatus: (status: 'idle' | 'syncing' | 'synced' | 'error', error?: string) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            // Initial state
            channels: [
                {
                    id: "general",
                    name: "General",
                    description: "Daily notes and thoughts",
                    createdAt: new Date(),
                    messageCount: 0,
                },
                {
                    id: "work",
                    name: "Work Log",
                    description: "Work-related notes and ideas",
                    createdAt: new Date(),
                    messageCount: 0,
                },
                {
                    id: "study",
                    name: "Study Notes",
                    description: "Learning and knowledge organization",
                    createdAt: new Date(),
                    messageCount: 0,
                },
            ],
            currentChannelId: "general",
            messages: [],
            userId: "user-" + Date.now(),

            // GitHub sync initial state
            isGitHubEnabled: false,
            syncStatus: 'idle' as const,
            lastSyncTime: null,
            syncError: null,

            // Actions
            addChannel: (channel) => {
                const newChannel: Channel = {
                    ...channel,
                    id: "channel-" + Date.now(),
                    createdAt: new Date(),
                    messageCount: 0,
                };
                set((state) => ({
                    channels: [...state.channels, newChannel],
                }));

                // 自动同步到 GitHub（如果启用）
                const state = get();
                if (state.isGitHubEnabled && state.syncStatus !== 'syncing') {
                    // 延迟同步，避免频繁调用
                    setTimeout(async () => {
                        try {
                            await githubSyncService.syncToGitHub();
                        } catch (error) {
                            console.warn('Auto sync failed:', error);
                        }
                    }, 1000);
                }
            },

            setCurrentChannel: (channelId) => {
                set({ currentChannelId: channelId });
            },

            addMessage: (message) => {
                const newMessage: Message = {
                    ...message,
                    id: "msg-" + Date.now(),
                    timestamp: new Date(),
                };

                set((state) => ({
                    messages: [...state.messages, newMessage],
                    channels: state.channels.map((channel) =>
                        channel.id === message.channelId
                            ? { ...channel, messageCount: channel.messageCount + 1 }
                            : channel
                    ),
                }));

                // 自动同步到 GitHub（如果启用）
                const state = get();
                if (state.isGitHubEnabled && state.syncStatus !== 'syncing') {
                    // 延迟同步，避免频繁调用
                    setTimeout(async () => {
                        try {
                            await githubSyncService.syncToGitHub();
                        } catch (error) {
                            console.warn('Auto sync failed:', error);
                        }
                    }, 1000);
                }
            },

            deleteMessage: (messageId) => {
                set((state) => ({
                    messages: state.messages.filter((msg) => msg.id !== messageId),
                }));
            },

            updateMessage: (messageId, updates) => {
                set((state) => ({
                    messages: state.messages.map((msg) =>
                        msg.id === messageId ? { ...msg, ...updates } : msg
                    ),
                }));
            },

            // Thread related actions
            addThreadMessage: (parentMessageId, message) => {
                set((state) => {
                    const parentMessage = state.messages.find((msg: Message) => msg.id === parentMessageId);
                    if (!parentMessage) return state;

                    const threadId = parentMessage.threadId || parentMessageId;
                    const newMessage: Message = {
                        ...message,
                        id: "msg-" + Date.now(),
                        timestamp: new Date(),
                        parentId: parentMessageId,
                        threadId: threadId,
                    };

                    return {
                        messages: [...state.messages, newMessage],
                        channels: state.channels.map((channel: Channel) =>
                            channel.id === message.channelId
                                ? { ...channel, messageCount: channel.messageCount + 1 }
                                : channel
                        ),
                    };
                });
            },

            toggleThreadExpansion: (messageId) => {
                set((state) => ({
                    messages: state.messages.map((msg) =>
                        msg.id === messageId
                            ? { ...msg, isThreadExpanded: !msg.isThreadExpanded }
                            : msg
                    ),
                }));
            },

            getThreadMessages: (threadId: string): Message[] => {
                const state = useChatStore.getState();
                return state.messages.filter((msg) => msg.threadId === threadId);
            },

            // GitHub sync actions
            enableGitHubSync: () => {
                set({ isGitHubEnabled: true });
            },

            disableGitHubSync: () => {
                set({ isGitHubEnabled: false });
            },

            syncToGitHub: async () => {
                console.log('[ChatStore] syncToGitHub');
                set({ syncStatus: 'syncing' });
                try {
                    await githubSyncService.syncToGitHub();

                    set({
                        syncStatus: 'synced',
                        lastSyncTime: new Date().toISOString(),
                        syncError: null
                    });
                } catch (error) {
                    console.log('[ChatStore] syncToGitHub error', error);
                    set({
                        syncStatus: 'error',
                        syncError: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            },

            loadFromGitHub: async () => {
                set({ syncStatus: 'syncing' });
                try {
                    await githubSyncService.loadFromGitHub();

                    set({
                        syncStatus: 'synced',
                        lastSyncTime: new Date().toISOString(),
                        syncError: null
                    });
                } catch (error) {
                    set({
                        syncStatus: 'error',
                        syncError: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            },

            setSyncStatus: (status, error) => {
                set({
                    syncStatus: status,
                    syncError: error || null,
                    lastSyncTime: status === 'synced' ? new Date().toISOString() : get().lastSyncTime
                });
            },
        }),
        {
            name: "echonote-chat-storage",
        }
    )
);

// Computed properties
export const useCurrentChannel = () => {
    const { channels, currentChannelId } = useChatStore();
    return channels.find((channel) => channel.id === currentChannelId) || null;
};

export const useCurrentChannelMessages = () => {
    const { messages, currentChannelId } = useChatStore();
    return messages.filter((message) =>
        message.channelId === currentChannelId &&
        !message.parentId // 排除thread消息
    );
}; 