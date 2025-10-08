import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isMobile } from "@/common/lib/breakpoint-utils";

export interface UIState {
  // AI Assistant state
  isAIAssistantOpen: boolean;
  
  // Thread sidebar state
  isThreadOpen: boolean;
  currentThreadId: string | null;
  
  // Settings sidebar state
  isSettingsOpen: boolean;
  
  // Mobile specific states
  isChannelListOpen: boolean;
  
  // Actions for AI Assistant
  openAIAssistant: () => void;
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

export const useUIStateStore = create<UIState>()(
  persist(
    (set) => ({
      // Initial state - open on desktop, closed on mobile
      isAIAssistantOpen: !isMobile(),
      isThreadOpen: false,
      currentThreadId: null,
      isSettingsOpen: false,
      isChannelListOpen: false,

      // AI Assistant actions (mutually exclusive with thread sidebar)
      openAIAssistant: () => {
        set({
          isAIAssistantOpen: true,
          isThreadOpen: false,
          currentThreadId: null,
        });
      },

      closeAIAssistant: () => {
        set({
          isAIAssistantOpen: false,
        });
      },

      // Thread actions (mutually exclusive with AI assistant)
      openThread: (messageId: string) => {
        set({
          isThreadOpen: true,
          currentThreadId: messageId,
          isAIAssistantOpen: false,
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
    }),
    {
      name: 'echonote-ui-state',
      // Only persist the AI assistant open/close state to satisfy the requirement
      partialize: (state) => ({ isAIAssistantOpen: state.isAIAssistantOpen }),
    }
  )
);
