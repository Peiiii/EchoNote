import { isMobile } from "@/common/lib/breakpoint-utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum SideViewEnum {
  AI_ASSISTANT = "ai_assistant",
  THREAD = "thread",  
  SETTINGS = "settings",
}

export interface UIState {
  // AI Assistant state
  // isAIAssistantOpen: boolean;

  // Thread sidebar state
  // isThreadOpen: boolean;
  sideView?: SideViewEnum;
  currentThreadId: string | null;

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
    (set, get) => ({
      // Initial state - desktop: AI panel open by default
      sideView: !isMobile() ? SideViewEnum.AI_ASSISTANT : undefined,
      currentThreadId: null,
      isChannelListOpen: false,

      // AI Assistant actions (mutually exclusive with thread sidebar)
      openAIAssistant: () => {
        set({
          sideView: SideViewEnum.AI_ASSISTANT,
          currentThreadId: null,
        });
      },

      closeAIAssistant: () => {
        set({
          sideView: undefined,
        });
      },

      // Thread actions (mutually exclusive with AI assistant)
      openThread: (messageId: string) => {
        set({
          sideView: SideViewEnum.THREAD,
          currentThreadId: messageId,
        });
      },

      closeThread: () => {
        set({
          sideView: undefined,
          currentThreadId: null,
        });
      },

      // Settings actions
      openSettings: () => {
        set({ sideView: SideViewEnum.SETTINGS });
      },

      closeSettings: () => {
        if (get().sideView === SideViewEnum.SETTINGS) {
          set({ sideView: undefined });
        }
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
      name: "echonote-ui-state",
      partialize: state => ({ sideView: state.sideView }),
    }
  )
);
