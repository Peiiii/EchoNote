import { X } from "lucide-react";
import { useMemo } from "react";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { AIAssistantCore } from "@/common/features/chat/components/ai-assistant-core/ai-assistant-core";
import { aiAgentFactory } from "@/common/features/chat/services/ai-agent-factory";

interface AIAssistantSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
}

export function AIAssistantSidebar({
    isOpen,
    onClose,
    channelId
}: AIAssistantSidebarProps) {
    const { channels } = useChatDataStore();
    const currentChannel = channels.find(ch => ch.id === channelId);

    // Create HttpAgent instance
    const agent = useMemo(() => aiAgentFactory.createAgent(), []);

    // Get channel-related tools
    const tools = useMemo(() => aiAgentFactory.getChannelTools(channelId), [channelId]);

    // Get channel context
    const contexts = useMemo(() => [aiAgentFactory.getChannelContext(channelId)], [channelId]);
    if (!isOpen) return null;

    return (
        <AIAssistantCore
            isOpen={isOpen}
            channelName={currentChannel?.name}
            agent={agent}
            tools={tools}
            contexts={contexts}
            variant="sidebar"
            showHeader={true}
            showFooter={true}
            extra={
                <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-accent flex-shrink-0"
                >
                    <X className="w-5 h-5" />
                </button>
            }
        />
    );
};
