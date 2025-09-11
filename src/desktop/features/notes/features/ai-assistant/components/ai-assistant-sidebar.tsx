import { X, MessageSquare, Bot as BotIcon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { AIAssistantCore } from "@/common/features/notes/components/ai-assistant-core/ai-assistant-core";
import { aiAgentFactory } from "@/common/features/notes/services/ai-agent-factory";
import { AIConversationInterface } from "./ai-conversation-interface";
import { Button } from "@/common/components/ui/button";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";

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
    const { channels } = useNotesDataStore();
    const currentChannel = channels.find(ch => ch.id === channelId);
    const [activeMode, setActiveMode] = useState<"assistant" | "conversations">("assistant");

    // Create HttpAgent instance
    const agent = useMemo(() => aiAgentFactory.createAgent(), []);

    // Get channel-related tools
    const tools = useMemo(() => aiAgentFactory.getChannelTools(channelId), [channelId]);

    // Get channel context
    const contexts = useMemo(() => aiAgentFactory.getChannelContext(channelId), [channelId]);

    // Listen for AI conversation requests
    useEffect(() => rxEventBusService.requestOpenAIConversation$.listen(({ channelId: requestedChannelId }) => {
        if (requestedChannelId === channelId) {
            setActiveMode("conversations");
        }
    }), [channelId]);

    if (!isOpen) return null;

    console.log("[AIAssistantSidebar] contexts", { contexts, tools, agent });

    return (
        <div className="h-full flex flex-col">
            {/* Header with mode toggle */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                            AI Assistant
                        </h3>
                        {currentChannel && (
                            <span className="text-sm text-muted-foreground">
                                - {currentChannel.name}
                            </span>
                        )}
                        {activeMode === "conversations" && (
                            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                                Chat Mode
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-accent flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={activeMode === "assistant" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveMode("assistant")}
                        className="flex-1"
                    >
                        <BotIcon className="w-4 h-4 mr-2" />
                        Assistant
                    </Button>
                    <Button
                        variant={activeMode === "conversations" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveMode("conversations")}
                        className="flex-1"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                    </Button>
                </div>
            </div>

            {/* Content based on active mode */}
            <div className="flex-1 overflow-hidden">
                {activeMode === "assistant" ? (
                    <AIAssistantCore
                        isOpen={true}
                        channelName={currentChannel?.name}
                        agent={agent}
                        tools={tools}
                        contexts={contexts}
                        variant="sidebar"
                        showHeader={false}
                        showFooter={true}
                    />
                ) : (
                    <AIConversationInterface
                        channelId={channelId}
                        onClose={onClose}
                        useModernChat={true}
                    />
                )}
            </div>
        </div>
    );
};
