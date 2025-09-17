import { useEffect, useRef } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useAIConversation } from "@/common/features/ai-assistant/hooks/use-ai-conversation";
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
        loadConversations,
        selectConversation
    } = useAIConversation();
    const conversationRef = useRef<MobileConversationRef>(null);

    useEffect(() => {
        if (userId && isOpen) {
            loadConversations(userId, channelId);
        }
    }, [userId, channelId, isOpen, loadConversations]);

    const handleCreateConversation = async () => {
        if (!userId) return;
        await createConversation(userId, channelId, "New Conversation");
    };

    if (!isOpen) return null;

    return (
        <AIConversationMobile
            ref={conversationRef}
            conversations={conversations}
            currentConversationId={currentConversationId}
            loading={loading}
            onSelect={(id) => selectConversation(id)}
            onCreate={handleCreateConversation}
            channelId={channelId}
        />
    );
};
