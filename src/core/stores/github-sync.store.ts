import { githubSyncService } from "@/common/services/github-sync.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GitHubSyncState {
  // GitHub sync state
  isGitHubEnabled: boolean;
  syncStatus: "idle" | "syncing" | "synced" | "error";
  lastSyncTime: string | null;
  syncError: string | null;

  // GitHub sync actions
  enableGitHubSync: () => void;
  disableGitHubSync: () => void;
  syncToGitHub: () => Promise<void>;
  loadFromGitHub: () => Promise<void>;
  setSyncStatus: (status: "idle" | "syncing" | "synced" | "error", error?: string) => void;
}

export const useGitHubSyncStore = create<GitHubSyncState>()(
  persist(
    (set, get) => ({
      // GitHub sync initial state
      isGitHubEnabled: false,
      syncStatus: "idle" as const,
      lastSyncTime: null,
      syncError: null,

      // GitHub sync actions
      enableGitHubSync: () => {
        set({ isGitHubEnabled: true });
      },

      disableGitHubSync: () => {
        set({ isGitHubEnabled: false });
      },

      syncToGitHub: async () => {
        console.log("[GitHubSyncStore] syncToGitHub");
        set({ syncStatus: "syncing" });
        try {
          await githubSyncService.syncToGitHub();

          set({
            syncStatus: "synced",
            lastSyncTime: new Date().toISOString(),
            syncError: null,
          });
        } catch (error) {
          console.log("[GitHubSyncStore] syncToGitHub error", error);
          set({
            syncStatus: "error",
            syncError: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      loadFromGitHub: async () => {
        set({ syncStatus: "syncing" });
        try {
          await githubSyncService.loadFromGitHub();

          set({
            syncStatus: "synced",
            lastSyncTime: new Date().toISOString(),
            syncError: null,
          });
        } catch (error) {
          set({
            syncStatus: "error",
            syncError: error instanceof Error ? error.message : "Unknown error",
          });
        }
      },

      setSyncStatus: (status, error) => {
        set({
          syncStatus: status,
          syncError: error || null,
          lastSyncTime: status === "synced" ? new Date().toISOString() : get().lastSyncTime,
        });
      },
    }),
    {
      name: "echonote-github-sync-storage",
    }
  )
);
