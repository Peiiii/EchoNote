import { isMobile } from "@/common/lib/breakpoint-utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum SideViewEnum {
  AI_ASSISTANT = "ai_assistant",
  THREAD = "thread",
  SETTINGS = "settings",
  STUDIO = "studio",
}

export interface UIState {
  // Unified side panel state - only one can be open at a time
  sideView?: SideViewEnum;

  // Thread specific context
  currentThreadId: string | null;

  // Mobile specific states
  isChannelListOpen: boolean;

  // Unified action to set side view
  setSideView: (view: SideViewEnum | undefined, threadId?: string | null) => void;
  closeSideView: () => void;

  // Convenience actions (for backward compatibility)
  openAIAssistant: () => void;
  closeAIAssistant: () => void;
  openThread: (messageId: string) => void;
  closeThread: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openStudio: () => void;
  closeStudio: () => void;

  // Legacy computed property for backward compatibility
  isStudioOpen: boolean;

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

      // Computed property for backward compatibility
      get isStudioOpen() {
        return get().sideView === SideViewEnum.STUDIO;
      },

      // Unified action to set side view
      setSideView: (view, threadId = null) => {
        set({
          sideView: view,
          currentThreadId: view === SideViewEnum.THREAD ? threadId : null,
        });
      },

      closeSideView: () => {
        set({
          sideView: undefined,
          currentThreadId: null,
        });
      },

      // Convenience actions
      openAIAssistant: () => {
        set({
          sideView: SideViewEnum.AI_ASSISTANT,
          currentThreadId: null,
        });
      },

      closeAIAssistant: () => {
        if (get().sideView === SideViewEnum.AI_ASSISTANT) {
          set({ sideView: undefined });
        }
      },

      openThread: (messageId: string) => {
        set({
          sideView: SideViewEnum.THREAD,
          currentThreadId: messageId,
        });
      },

      closeThread: () => {
        if (get().sideView === SideViewEnum.THREAD) {
          set({
            sideView: undefined,
            currentThreadId: null,
          });
        }
      },

      openSettings: () => {
        set({
          sideView: SideViewEnum.SETTINGS,
          currentThreadId: null,
        });
      },

      closeSettings: () => {
        if (get().sideView === SideViewEnum.SETTINGS) {
          set({ sideView: undefined });
        }
      },

      openStudio: () => {
        set({
          sideView: SideViewEnum.STUDIO,
          currentThreadId: null,
        });
      },

      closeStudio: () => {
        if (get().sideView === SideViewEnum.STUDIO) {
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
      name: "stillroot-ui-state",
      partialize: state => ({ sideView: state.sideView }),
    }
  )
);
