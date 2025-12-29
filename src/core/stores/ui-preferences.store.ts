import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UIPreferencesState {
  // Sidebar states
  isLeftSidebarCollapsed: boolean;

  // Panel states
  rightSidebarVisible: boolean;
  rightSidebarSize: number;

  // Layout preferences
  layoutMode: "default" | "compact" | "wide";

  // Display settings
  showTimestamps: boolean;
  showUserAvatars: boolean;

  // Timeline cover collapsed - global (was per-channel)
  timelineCoverCollapsed: boolean;
  // Timeline input states keyed by channel id
  timelineInputCollapsed: Record<string, boolean>;

  // Actions
  toggleLeftSidebar: () => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  setRightSidebarVisible: (visible: boolean) => void;
  setRightSidebarSize: (size: number) => void;
  setLayoutMode: (mode: "default" | "compact" | "wide") => void;
  setShowTimestamps: (show: boolean) => void;
  setShowUserAvatars: (show: boolean) => void;
  // Set global timeline cover collapsed
  setTimelineCoverCollapsed: (collapsed: boolean) => void;
  setTimelineInputCollapsed: (channelId: string, collapsed: boolean) => void;
}

export const useUIPreferencesStore = create<UIPreferencesState>()(
  persist(
    set => ({
      // Initial state
      isLeftSidebarCollapsed: false,
      rightSidebarVisible: false,
      rightSidebarSize: 35,
      layoutMode: "default",
      showTimestamps: true,
      showUserAvatars: true,
      timelineCoverCollapsed: true,
      timelineInputCollapsed: {},

      // Actions
      toggleLeftSidebar: () => {
        set(state => ({
          isLeftSidebarCollapsed: !state.isLeftSidebarCollapsed,
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

      setLayoutMode: (mode: "default" | "compact" | "wide") => {
        set({ layoutMode: mode });
      },

      setShowTimestamps: (show: boolean) => {
        set({ showTimestamps: show });
      },

      setShowUserAvatars: (show: boolean) => {
        set({ showUserAvatars: show });
      },

      setTimelineCoverCollapsed: (collapsed: boolean) => {
        set({ timelineCoverCollapsed: collapsed });
      },

      setTimelineInputCollapsed: (channelId: string, collapsed: boolean) => {
        set(state => ({
          timelineInputCollapsed: {
            ...state.timelineInputCollapsed,
            [channelId]: collapsed,
          },
        }));
      },
    }),
    {
      name: "echonote-ui-preferences-storage",
      // Persist selected UI preferences only
      partialize: state => ({
        isLeftSidebarCollapsed: state.isLeftSidebarCollapsed,
        rightSidebarVisible: state.rightSidebarVisible,
        rightSidebarSize: state.rightSidebarSize,
        layoutMode: state.layoutMode,
        showTimestamps: state.showTimestamps,
        showUserAvatars: state.showUserAvatars,
        timelineCoverCollapsed: state.timelineCoverCollapsed,
        timelineInputCollapsed: state.timelineInputCollapsed,
      }),
      // Migrate from older versions where timelineCoverCollapsed was a Record<string, boolean>
      version: 2,
      migrate: (persisted, version) => {
        // If the previous version had per-channel map, convert to a single boolean
        if (version < 2 && persisted && typeof persisted === "object") {
          type PersistedShape = Partial<UIPreferencesState> & {
            // In v1 this was a Record<string, boolean>; in v2 it's a boolean
            timelineCoverCollapsed?: boolean | Record<string, boolean>;
          };
          const prev = persisted as PersistedShape;
          const map = prev.timelineCoverCollapsed;
          let collapsed: boolean;
          if (map && typeof map === "object" && !Array.isArray(map)) {
            // If any channel was collapsed, treat global as collapsed; otherwise default false
            collapsed = Object.values(map as Record<string, boolean>).some(Boolean);
          } else {
            collapsed = !!map;
          }
          const nextState: PersistedShape = {
            ...prev,
            timelineCoverCollapsed: collapsed,
          };
          return nextState as unknown as UIPreferencesState;
        }
        return persisted as UIPreferencesState;
      },
    }
  )
);
