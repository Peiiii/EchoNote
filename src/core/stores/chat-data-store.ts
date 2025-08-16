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
    userId: string;

    // Data actions
    addChannel: (channel: Omit<Channel, "id" | "createdAt" | "messageCount">) => void;
    addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
    deleteMessage: (messageId: string) => void;
    updateMessage: (messageId: string, updates: Partial<Message>) => void;
    
    // Thread related actions
    addThreadMessage: (parentMessageId: string, message: Omit<Message, "id" | "timestamp" | "parentId" | "threadId">) => void;
    getThreadMessages: (threadId: string) => Message[];
}

export const useChatDataStore = create<ChatDataState>()(
    persist(
        (set) => ({
            // Initial data state
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
            messages: [],
            userId: "user-" + Date.now(),

            // Data actions
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

            getThreadMessages: (threadId: string): Message[] => {
                const state = useChatDataStore.getState();
                return state.messages.filter((msg) => msg.threadId === threadId);
            },
        }),
        {
            name: "echonote-chat-data-storage",
        }
    )
);
