import { useEffect, useRef } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { AIConversationMobile, MobileConversationRef } from "./ai-conversation-mobile";

interface MobileAIAssistantProps {
    channelId: string;
    isOpen: boolean;
}

export const MobileAIAssistant = ({ 
    channelId, 
    isOpen, 
}: MobileAIAssistantProps) => {
    const { userId } = useNotesDataStore();
    const {
        conversations,
        currentConversationId,
        loading,
        createConversation,
        loadConversations
    } = useConversationState();
    const conversationRef = useRef<MobileConversationRef>(null);

    useEffect(() => {
        if (userId && isOpen) {
            loadConversations(userId, channelId);
        }
    }, [userId, channelId, isOpen, loadConversations]);

    const handleCreateConversation = () => {
        if (!userId) return;
        void createConversation(userId, channelId, "New Conversation");
    };

    if (!isOpen) return null;

    return (
        <AIConversationMobile
            ref={conversationRef}
            conversations={conversations}
            currentConversationId={currentConversationId}
            loading={loading}
            onCreate={handleCreateConversation}
            channelId={channelId}
        />
    );
};
