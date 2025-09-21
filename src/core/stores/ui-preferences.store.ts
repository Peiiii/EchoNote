import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UIPreferencesState {
  // Sidebar states
  isLeftSidebarCollapsed: boolean;
  
  // Panel states
  rightSidebarVisible: boolean;
  rightSidebarSize: number;
  
  // Layout preferences
  layoutMode: 'default' | 'compact' | 'wide';
  
  // Display settings
  showTimestamps: boolean;
  showUserAvatars: boolean;

  // Timeline cover states keyed by channel id
  timelineCoverCollapsed: Record<string, boolean>;
  
  // Actions
  toggleLeftSidebar: () => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  setRightSidebarVisible: (visible: boolean) => void;
  setRightSidebarSize: (size: number) => void;
  setLayoutMode: (mode: 'default' | 'compact' | 'wide') => void;
  setShowTimestamps: (show: boolean) => void;
  setShowUserAvatars: (show: boolean) => void;
  setTimelineCoverCollapsed: (channelId: string, collapsed: boolean) => void;
}

export const useUIPreferencesStore = create<UIPreferencesState>()(
  persist(
    (set) => ({
      // Initial state
      isLeftSidebarCollapsed: false,
      rightSidebarVisible: false,
      rightSidebarSize: 35,
      layoutMode: 'default',
      showTimestamps: true,
      showUserAvatars: true,
      timelineCoverCollapsed: {},

      // Actions
      toggleLeftSidebar: () => {
        set((state) => ({ 
          isLeftSidebarCollapsed: !state.isLeftSidebarCollapsed 
        }));
      },

      setLeftSidebarCollapsed: (collapsed: boolean) => {
        set({ isLeftSidebarCollapsed: collapsed });
      },

      setRightSidebarVisible: (visible: boolean) => {
        set({ rightSidebarVisible: visible });
      },

      setRightSidebarSize: (size: number) => {
        set({ rightSidebarSize: size });
      },

      setLayoutMode: (mode: 'default' | 'compact' | 'wide') => {
        set({ layoutMode: mode });
      },

      setShowTimestamps: (show: boolean) => {
        set({ showTimestamps: show });
      },

      setShowUserAvatars: (show: boolean) => {
        set({ showUserAvatars: show });
      },

      setTimelineCoverCollapsed: (channelId: string, collapsed: boolean) => {
        set((state) => ({
          timelineCoverCollapsed: {
            ...state.timelineCoverCollapsed,
            [channelId]: collapsed,
          },
        }));
      },
    }),
    {
      name: "echonote-ui-preferences-storage",
      // Only persist UI preferences, not temporary states
      partialize: (state) => ({
        isLeftSidebarCollapsed: state.isLeftSidebarCollapsed,
        rightSidebarVisible: state.rightSidebarVisible,
        rightSidebarSize: state.rightSidebarSize,
        layoutMode: state.layoutMode,
        showTimestamps: state.showTimestamps,
        showUserAvatars: state.showUserAvatars,
        timelineCoverCollapsed: state.timelineCoverCollapsed,
      }),
    }
  )
);
