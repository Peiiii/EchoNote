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

  // Studio panel visibility (independent from sideView)
  isStudioOpen: boolean;

  // Actions for AI Assistant
  openAIAssistant: () => void;
  closeAIAssistant: () => void;

  // Actions for Thread
  openThread: (messageId: string) => void;
  closeThread: () => void;

  // Actions for Settings
  openSettings: () => void;
  closeSettings: () => void;

  // Actions for Studio
  openStudio: () => void;
  closeStudio: () => void;

  // Actions for Mobile
  openChannelList: () => void;
  closeChannelList: () => void;
}

export const useUIStateStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state - desktop: AI panel open by default (mutually exclusive with studio)
      sideView: !isMobile() ? SideViewEnum.AI_ASSISTANT : undefined,
      currentThreadId: null,
      isChannelListOpen: false,
      isStudioOpen: false, // Default closed to maintain mutual exclusivity with sideView

      // AI Assistant actions (mutually exclusive with thread sidebar and studio)
      openAIAssistant: () => {
        set({
          sideView: SideViewEnum.AI_ASSISTANT,
          currentThreadId: null,
          isStudioOpen: false, // Close studio when opening AI assistant
        });
      },

      closeAIAssistant: () => {
        set({
          sideView: undefined,
        });
      },

      // Thread actions (mutually exclusive with AI assistant and studio)
      openThread: (messageId: string) => {
        set({
          sideView: SideViewEnum.THREAD,
          currentThreadId: messageId,
          isStudioOpen: false, // Close studio when opening thread
        });
      },

      closeThread: () => {
        set({
          sideView: undefined,
          currentThreadId: null,
        });
      },

      // Settings actions (mutually exclusive with studio)
      openSettings: () => {
        set({
          sideView: SideViewEnum.SETTINGS,
          isStudioOpen: false, // Close studio when opening settings
        });
      },

      closeSettings: () => {
        if (get().sideView === SideViewEnum.SETTINGS) {
          set({ sideView: undefined });
        }
      },

      // Studio actions (mutually exclusive with sideView)
      openStudio: () => {
        set({
          isStudioOpen: true,
          sideView: undefined, // Close sideView when opening studio
          currentThreadId: null, // Also clear thread ID
        });
      },

      closeStudio: () => {
        set({ isStudioOpen: false });
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
      partialize: state => ({ sideView: state.sideView, isStudioOpen: state.isStudioOpen }),
    }
  )
);
