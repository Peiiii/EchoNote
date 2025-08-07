import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    channelId: string;
    tags?: string[];
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

    // Actions
    addChannel: (channel: Omit<Channel, "id" | "createdAt" | "messageCount">) => void;
    setCurrentChannel: (channelId: string) => void;
    addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
    deleteMessage: (messageId: string) => void;
    updateMessage: (messageId: string, updates: Partial<Message>) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
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
    return messages.filter((message) => message.channelId === currentChannelId);
}; 