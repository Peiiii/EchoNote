import { useState } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

export function useThreadSidebar() {
    const { currentChannelId } = useNotesViewStore();
    const addThreadMessage = useNotesDataStore(state => state.addThreadMessage);

    // // 直接从store获取当前channel的消息，避免重复订阅
    // const { messages } = useNotesDataStore(state =>
    //     currentChannelId ? state.messagesByChannel[currentChannelId] || {
    //         messages: [],
    //         loading: false,
    //         hasMore: true,
    //         lastVisible: null
    //     } : {
    //         messages: [],
    //         loading: false,
    //         hasMore: true,
    //         lastVisible: null
    //     }
    // );

    // Thread sidebar state
    const [isThreadOpen, setIsThreadOpen] = useState(false);
    const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(undefined);

    // Thread handlers
    const handleOpenThread = (messageId: string) => {
        setCurrentThreadId(messageId);
        setIsThreadOpen(true);
    };

    const handleCloseThread = () => {
        setIsThreadOpen(false);
        setCurrentThreadId(undefined);
    };

    const handleSendThreadMessage = (content: string) => {
        if (currentThreadId) {
            addThreadMessage(currentThreadId, {
                content,
                sender: "user" as const,
                channelId: currentChannelId || "",
            });
        }
    };

    // const currentParentMessage = currentThreadId
    //     ? messages.find(m => m.id === currentThreadId) || null
    //     : null;

    // const currentThreadMessages = currentThreadId
    //     ? messages.filter(m => m.threadId === currentThreadId)
    //     : [];

    return {
        // State
        isThreadOpen,
        currentThreadId,
        // currentParentMessage,
        // currentThreadMessages,

        // Handlers
        handleOpenThread,
        handleCloseThread,
        handleSendThreadMessage
    };
}
