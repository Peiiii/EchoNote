import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "./notes-data.store";
import { useNotesDataStore } from "./notes-data.store";
import { User } from "firebase/auth";
import { addRecentChannel } from "@/common/lib/recent-channels";

export interface NotesViewState {
  // View state
  currentChannelId: string | null;

  // Loading states
  isAddingMessage: boolean;
  isUpdatingMessage: boolean;
  isDeletingMessage: boolean;

  // User auth states
  currentUser: User | null;
  authIsReady: boolean;

  // Auth actions
  setAuth: (user: User | null) => void;

  // View actions
  setCurrentChannel: (channelId: string | null) => void;
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
      isAddingMessage: false,
      isUpdatingMessage: false,
      isDeletingMessage: false,
      currentUser: null,
      authIsReady: false,

      // Auth actions
      setAuth: user => {
        set({ currentUser: user, authIsReady: true });
      },

      // View actions
      setCurrentChannel: channelId => {
        set({ currentChannelId: channelId });
        if (channelId) {
          addRecentChannel(channelId);
        }
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
    }
  )
);
