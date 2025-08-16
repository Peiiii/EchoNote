import { githubSyncService } from "@/common/services/github-sync.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useChatDataStore } from "./chat-data-store";

export interface ChatViewState {
    // View state
    currentChannelId: string | null;
    
    // GitHub sync state
    isGitHubEnabled: boolean;
    syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
    lastSyncTime: string | null;
    syncError: string | null;

    // View actions
    setCurrentChannel: (channelId: string) => void;
    toggleThreadExpansion: (messageId: string) => void;

    // GitHub sync actions
    enableGitHubSync: () => void;
    disableGitHubSync: () => void;
    syncToGitHub: () => Promise<void>;
    loadFromGitHub: () => Promise<void>;
    setSyncStatus: (status: 'idle' | 'syncing' | 'synced' | 'error', error?: string) => void;
}

export const useChatViewStore = create<ChatViewState>()(
    persist(
        (set, get) => ({
            // Initial view state
            currentChannelId: "general",

            // GitHub sync initial state
            isGitHubEnabled: false,
            syncStatus: 'idle' as const,
            lastSyncTime: null,
            syncError: null,

            // View actions
            setCurrentChannel: (channelId) => {
                set({ currentChannelId: channelId });
            },

            toggleThreadExpansion: (messageId) => {
                const dataStore = useChatDataStore.getState();
                const message = dataStore.messages.find(msg => msg.id === messageId);
                if (message) {
                    dataStore.updateMessage(messageId, {
                        isThreadExpanded: !message.isThreadExpanded
                    });
                }
            },

            // GitHub sync actions
            enableGitHubSync: () => {
                set({ isGitHubEnabled: true });
            },

            disableGitHubSync: () => {
                set({ isGitHubEnabled: false });
            },

            syncToGitHub: async () => {
                console.log('[ChatViewStore] syncToGitHub');
                set({ syncStatus: 'syncing' });
                try {
                    await githubSyncService.syncToGitHub();

                    set({
                        syncStatus: 'synced',
                        lastSyncTime: new Date().toISOString(),
                        syncError: null
                    });
                } catch (error) {
                    console.log('[ChatViewStore] syncToGitHub error', error);
                    set({
                        syncStatus: 'error',
                        syncError: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            },

            loadFromGitHub: async () => {
                set({ syncStatus: 'syncing' });
                try {
                    await githubSyncService.loadFromGitHub();

                    set({
                        syncStatus: 'synced',
                        lastSyncTime: new Date().toISOString(),
                        syncError: null
                    });
                } catch (error) {
                    set({
                        syncStatus: 'error',
                        syncError: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            },

            setSyncStatus: (status, error) => {
                set({
                    syncStatus: status,
                    syncError: error || null,
                    lastSyncTime: status === 'synced' ? new Date().toISOString() : get().lastSyncTime
                });
            },
        }),
        {
            name: "echonote-chat-view-storage",
        }
    )
);
