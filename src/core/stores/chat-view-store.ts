import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatViewState {
    // View state
    currentChannelId: string | null;

    // View actions
    setCurrentChannel: (channelId: string) => void;
}

export const useChatViewStore = create<ChatViewState>()(
    persist(
        (set) => ({
            // Initial view state
            currentChannelId: "general",

            // View actions
            setCurrentChannel: (channelId) => {
                set({ currentChannelId: channelId });
            },
        }),
        {
            name: "echonote-chat-view-storage",
        }
    )
);
