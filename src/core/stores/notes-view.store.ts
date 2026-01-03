import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "./notes-data.store";
import { useNotesDataStore } from "./notes-data.store";
import { User } from "firebase/auth";
import { addRecentChannel } from "@/common/lib/recent-channels";

export interface NotesViewState {
  // View state
  currentChannelId: string | null;
  /** Remember last selected channel per userId (guest:* or firebase uid). */
  lastChannelIdByUserId: Record<string, string>;
  hasHydrated: boolean;

  // Loading states
  isAddingMessage: boolean;
  isUpdatingMessage: boolean;
  isDeletingMessage: boolean;

  // User auth states
  currentUser: User | null;

  // Auth actions
  setAuth: (user: User | null) => void;

  // View actions
  setCurrentChannel: (channelId: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setIsAddingMessage: (isLoading: boolean) => void;
  setIsUpdatingMessage: (isLoading: boolean) => void;
  setIsDeletingMessage: (isLoading: boolean) => void;
  // Data actions
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  updateMessage: (messageId: string, updates: Partial<Message>) => Promise<void>;
}

export const useNotesViewStore = create<NotesViewState>()(
  persist(
    (set, get) => ({
      // Initial view state
      currentChannelId: null,
      lastChannelIdByUserId: {},
      hasHydrated: false,
      isAddingMessage: false,
      isUpdatingMessage: false,
      isDeletingMessage: false,
      currentUser: null,

      // Auth actions
      setAuth: user => {
        set({ currentUser: user });
      },

      // View actions
      setCurrentChannel: channelId => {
        const userId = useNotesDataStore.getState().userId;
        set(state => ({
          currentChannelId: channelId,
          lastChannelIdByUserId:
            userId && channelId
              ? { ...state.lastChannelIdByUserId, [userId]: channelId }
              : state.lastChannelIdByUserId,
        }));
        if (channelId) {
          addRecentChannel(channelId);
        }
      },
      setHasHydrated: hydrated => {
        set({ hasHydrated: hydrated });
      },
      setIsAddingMessage: isLoading => {
        set({ isAddingMessage: isLoading });
      },
      setIsUpdatingMessage: isLoading => {
        set({ isUpdatingMessage: isLoading });
      },
      setIsDeletingMessage: isLoading => {
        set({ isDeletingMessage: isLoading });
      },
      // Data actions
      addMessage: async message => {
        // 设置加载状态
        get().setIsAddingMessage(true);
        try {
          await useNotesDataStore.getState().addMessage(message);
        } finally {
          // 重置加载状态
          get().setIsAddingMessage(false);
        }
      },
      deleteMessage: async messageId => {
        // 设置加载状态
        get().setIsDeletingMessage(true);
        try {
          await useNotesDataStore.getState().deleteMessage(messageId);
        } finally {
          // 重置加载状态
          get().setIsDeletingMessage(false);
        }
      },
      updateMessage: async (messageId, updates) => {
        // 设置加载状态
        get().setIsUpdatingMessage(true);
        try {
          await useNotesDataStore.getState().updateMessage(messageId, updates);
        } finally {
          // 重置加载状态
          get().setIsUpdatingMessage(false);
        }
      },
    }),
    {
      name: "echonote-notes-view-storage",
      version: 2,
      // Only persist serializable view preferences; never persist Firebase User objects.
      partialize: state => ({
        lastChannelIdByUserId: state.lastChannelIdByUserId,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        state?.setHasHydrated(true);
      },
      migrate: (persisted, version) => {
        if (version < 2 && persisted && typeof persisted === "object") {
          // Drop any legacy persisted fields that could be non-serializable (e.g., Firebase User).
          const prev = persisted as Partial<NotesViewState>;
          return {
            lastChannelIdByUserId: prev.lastChannelIdByUserId ?? {},
          } as unknown as NotesViewState;
        }
        return persisted as NotesViewState;
      },
    }
  )
);
