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
    // 频道相关
    channels: Channel[];
    currentChannelId: string | null;
    
    // 消息相关
    messages: Message[];
    
    // 用户相关
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
        (set, get) => ({
            // 初始状态
            channels: [
                {
                    id: "general",
                    name: "通用",
                    description: "日常记录和想法",
                    createdAt: new Date(),
                    messageCount: 0,
                },
                {
                    id: "work",
                    name: "工作日志",
                    description: "工作相关的记录和想法",
                    createdAt: new Date(),
                    messageCount: 0,
                },
                {
                    id: "study",
                    name: "学习笔记",
                    description: "学习和知识整理",
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

// 计算属性
export const useCurrentChannel = () => {
    const { channels, currentChannelId } = useChatStore();
    return channels.find((channel) => channel.id === currentChannelId) || null;
};

export const useCurrentChannelMessages = () => {
    const { messages, currentChannelId } = useChatStore();
    return messages.filter((message) => message.channelId === currentChannelId);
}; 