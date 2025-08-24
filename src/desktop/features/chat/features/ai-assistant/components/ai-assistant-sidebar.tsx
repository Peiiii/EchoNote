import { X, Bot } from "lucide-react";
import { useMemo } from "react";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { AgentChatCore } from "@agent-labs/agent-chat";
import { aiAgentFactory } from "@/desktop/features/chat/features/ai-assistant/services/ai-agent-factory";

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
        <div className="h-full flex flex-col bg-card dark:bg-card w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="font-semibold text-foreground truncate">
                        AI Assistant
                    </h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex-shrink-0">
                        {currentChannel?.name}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-accent flex-shrink-0"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* AI Chat Interface - prevent width expansion */}
            <div
                className="flex-1 overflow-hidden w-full"
            >
                <div
                    className="h-full w-full"
                    style={{
                        maxWidth: '100%',
                        overflow: 'hidden',
                        // contain: 'layout size'
                    }}
                >
                    <AgentChatCore
                        agent={agent}
                        tools={tools}
                        contexts={contexts}
                        className="h-full w-full max-w-full"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-accent flex-shrink-0">
                <div className="text-xs text-muted-foreground text-center">
                    <p className="truncate">AI Assistant understands channel "{currentChannel?.name}"</p>
                    <p className="truncate">Ask questions or use available tools</p>
                </div>
            </div>
        </div>
    );
};
