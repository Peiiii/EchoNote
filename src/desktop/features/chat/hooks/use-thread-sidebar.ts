import { useState } from "react";
import { useChatDataStore } from "@/core/stores/chat-data-store";

export function useThreadSidebar() {
    const { messages, getThreadMessages, addThreadMessage } = useChatDataStore();
    
    // Thread sidebar state
    const [isThreadOpen, setIsThreadOpen] = useState(false);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

    // Thread handlers
    const handleOpenThread = (messageId: string) => {
        setCurrentThreadId(messageId);
        setIsThreadOpen(true);
    };

    const handleCloseThread = () => {
        setIsThreadOpen(false);
        setCurrentThreadId(null);
    };

    const handleSendThreadMessage = (content: string) => {
        if (currentThreadId) {
            addThreadMessage(currentThreadId, {
                content,
                sender: "user" as const,
                channelId: messages[0]?.channelId || "",
            });
        }
    };

    const currentParentMessage = currentThreadId 
        ? messages.find(m => m.id === currentThreadId) || null
        : null;
    
    const currentThreadMessages = currentThreadId 
        ? getThreadMessages(currentThreadId)
        : [];

    return {
        // State
        isThreadOpen,
        currentParentMessage,
        currentThreadMessages,
        
        // Handlers
        handleOpenThread,
        handleCloseThread,
        handleSendThreadMessage
    };
};
