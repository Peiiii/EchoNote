import { useMemo } from "react";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { AIAssistantCore } from "@/common/features/chat/components/ai-assistant-core/ai-assistant-core";
import { aiAgentFactory } from "@/common/features/chat/services/ai-agent-factory";

interface MobileAIAssistantProps {
    channelId: string;
    isOpen: boolean;
    onClose?: () => void;
}

export const MobileAIAssistant = ({ 
    channelId, 
    isOpen, 
    onClose 
}: MobileAIAssistantProps) => {
    const { channels } = useChatDataStore();
    const currentChannel = channels.find(ch => ch.id === channelId);

    // Create HttpAgent instance
    const agent = useMemo(() => aiAgentFactory.createAgent(), []);

    // Get channel-related tools
    const tools = useMemo(() => aiAgentFactory.getChannelTools(channelId), [channelId]);

    // Get channel context
    const contexts = useMemo(() => {
        const context = aiAgentFactory.getChannelContext(channelId);
        return context ? [context] : [];
    }, [channelId]);

    return (
        <AIAssistantCore
            isOpen={isOpen}
            onClose={onClose}
            channelName={currentChannel?.name}
            agent={agent}
            tools={tools}
            contexts={contexts}
            variant="fullscreen"
            showHeader={true}
            showFooter={true}
        />
    );
};
