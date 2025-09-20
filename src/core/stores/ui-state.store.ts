import { create } from "zustand";

export interface UIState {
  // AI Assistant state
  isAIAssistantOpen: boolean;
  aiAssistantChannelId: string | null;
  
  // Thread sidebar state
  isThreadOpen: boolean;
  currentThreadId: string | null;
  
  // Settings sidebar state
  isSettingsOpen: boolean;
  
  // Mobile specific states
  isChannelListOpen: boolean;
  
  // Actions for AI Assistant
  openAIAssistant: (channelId: string) => void;
  closeAIAssistant: () => void;
  
  // Actions for Thread
  openThread: (messageId: string) => void;
  closeThread: () => void;
  
  // Actions for Settings
  openSettings: () => void;
  closeSettings: () => void;
  
  // Actions for Mobile
  openChannelList: () => void;
  closeChannelList: () => void;
}

export const useUIStateStore = create<UIState>((set) => ({
  // Initial state
  isAIAssistantOpen: false,
  aiAssistantChannelId: null,
  isThreadOpen: false,
  currentThreadId: null,
  isSettingsOpen: false,
  isChannelListOpen: false,
  
  // AI Assistant actions
  openAIAssistant: (channelId: string) => {
    set({
      isAIAssistantOpen: true,
      aiAssistantChannelId: channelId,
    });
  },
  
  closeAIAssistant: () => {
    set({
      isAIAssistantOpen: false,
      aiAssistantChannelId: null,
    });
  },
  
  // Thread actions
  openThread: (messageId: string) => {
    set({
      isThreadOpen: true,
      currentThreadId: messageId,
    });
  },
  
  closeThread: () => {
    set({
      isThreadOpen: false,
      currentThreadId: null,
    });
  },
  
  // Settings actions
  openSettings: () => {
    set({ isSettingsOpen: true });
  },
  
  closeSettings: () => {
    set({ isSettingsOpen: false });
  },
  
  // Mobile actions
  openChannelList: () => {
    set({ isChannelListOpen: true });
  },
  
  closeChannelList: () => {
    set({ isChannelListOpen: false });
  },
}));
