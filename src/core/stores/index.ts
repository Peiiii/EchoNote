import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AppState, User, Channel, Message, Tag, UIState, UserSettings } from '@/common/types';

// 创建主应用store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        user: null,
        channels: [],
        messages: {},
        tags: [],
        ui: {
          currentChannelId: null,
          sidebarOpen: true,
          theme: 'system',
          loading: false,
          error: null,
          modal: {
            type: null,
            data: null,
          },
        },
        settings: {
          theme: 'system',
          language: 'zh-CN',
          notifications: true,
          autoSave: true,
        },

        // Actions
        setUser: (user: User | null) => set({ user }),
        setChannels: (channels: Channel[]) => set({ channels }),
        setMessages: (channelId: string, messages: Message[]) => 
          set((state) => ({
            messages: {
              ...state.messages,
              [channelId]: messages,
            },
          })),
        setTags: (tags: Tag[]) => set({ tags }),
        setUI: (ui: Partial<UIState>) => 
          set((state) => ({
            ui: { ...state.ui, ...ui },
          })),
        setSettings: (settings: Partial<UserSettings>) =>
          set((state) => ({
            settings: { ...state.settings, ...settings },
          })),

        // 频道相关actions
        addChannel: (channel: Channel) =>
          set((state) => ({
            channels: [...state.channels, channel],
          })),
        updateChannel: (channelId: string, updates: Partial<Channel>) =>
          set((state) => ({
            channels: state.channels.map((channel) =>
              channel.id === channelId ? { ...channel, ...updates } : channel
            ),
          })),
        deleteChannel: (channelId: string) =>
          set((state) => ({
            channels: state.channels.filter((channel) => channel.id !== channelId),
            messages: Object.fromEntries(
              Object.entries(state.messages).filter(([id]) => id !== channelId)
            ),
          })),

        // 消息相关actions
        addMessage: (channelId: string, message: Message) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [channelId]: [...(state.messages[channelId] || []), message],
            },
          })),
        updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [channelId]: (state.messages[channelId] || []).map((message) =>
                message.id === messageId ? { ...message, ...updates } : message
              ),
            },
          })),
        deleteMessage: (channelId: string, messageId: string) =>
          set((state) => ({
            messages: {
              ...state.messages,
              [channelId]: (state.messages[channelId] || []).filter(
                (message) => message.id !== messageId
              ),
            },
          })),

        // 标签相关actions
        addTag: (tag: Tag) =>
          set((state) => ({
            tags: [...state.tags, tag],
          })),
        updateTag: (tagId: string, updates: Partial<Tag>) =>
          set((state) => ({
            tags: state.tags.map((tag) =>
              tag.id === tagId ? { ...tag, ...updates } : tag
            ),
          })),
        deleteTag: (tagId: string) =>
          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== tagId),
          })),

        // UI相关actions
        setCurrentChannel: (channelId: string | null) =>
          set((state) => ({
            ui: { ...state.ui, currentChannelId: channelId },
          })),
        toggleSidebar: () =>
          set((state) => ({
            ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen },
          })),
        setTheme: (theme: 'light' | 'dark' | 'system') =>
          set((state) => ({
            ui: { ...state.ui, theme },
            settings: { ...state.settings, theme },
          })),
        setLoading: (loading: boolean) =>
          set((state) => ({
            ui: { ...state.ui, loading },
          })),
        setError: (error: string | null) =>
          set((state) => ({
            ui: { ...state.ui, error },
          })),
        openModal: (type: string, data?: any) =>
          set((state) => ({
            ui: { ...state.ui, modal: { type, data } },
          })),
        closeModal: () =>
          set((state) => ({
            ui: { ...state.ui, modal: { type: null, data: null } },
          })),
      }),
      {
        name: 'echonote-storage',
        partialize: (state) => ({
          user: state.user,
          channels: state.channels,
          messages: state.messages,
          tags: state.tags,
          settings: state.settings,
        }),
      }
    ),
    {
      name: 'echonote-store',
    }
  )
);

// 导出便捷的hooks
export const useUser = () => useAppStore((state) => state.user);
export const useChannels = () => useAppStore((state) => state.channels);
export const useMessages = (channelId: string) => 
  useAppStore((state) => state.messages[channelId] || []);
export const useTags = () => useAppStore((state) => state.tags);
export const useUI = () => useAppStore((state) => state.ui);
export const useSettings = () => useAppStore((state) => state.settings);
export const useCurrentChannel = () => 
  useAppStore((state) => 
    state.channels.find(channel => channel.id === state.ui.currentChannelId)
  ); 