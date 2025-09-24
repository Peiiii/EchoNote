import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { Plus, MessageSquare, X } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { AIConversationInterface, AIConversationInterfaceRef } from "./ai-conversation-interface";
import { useRef } from "react";
import { ConversationContextControl } from "@/common/features/ai-assistant/components/conversation-context-control";
// removed: creation-time context dropdown; we now use in-chat context control

interface AIAssistantSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
}

export function AIAssistantSidebar({ isOpen, onClose, channelId }: AIAssistantSidebarProps) {
    const { userId } = useNotesDataStore();
    const convRef = useRef<AIConversationInterfaceRef>(null);
    const { currentConversation, createConversation } = useConversationState();
    const uiView = useConversationStore(s => s.uiView);
    const titleGeneratingMap = useConversationStore(s => s.titleGeneratingMap);

    if (!isOpen) return null;

    const getTitle = () => {
        if (uiView === 'list') return 'Conversations';
        if (currentConversation) return titleGeneratingMap[currentConversation.id] ? "Generating Title..." : currentConversation.title || 'AI Conversations';
        return 'AI Conversations';
    };

    return (
        <div className="h-full flex flex-col">
            <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{getTitle()}</h3>
                        {currentConversation && (
                          <ConversationContextControl
                            conversationId={currentConversation.id}
                            fallbackChannelId={channelId}
                            variant="inline"
                          />
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const api = convRef.current;
                                if (!api) return;
                                if (api.isSinglePane()) api.showList();
                            }}
                            aria-label="Conversations"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { if (userId) void createConversation(userId, 'New Conversation'); }}
                            aria-label="New conversation"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <AIConversationInterface ref={convRef} channelId={channelId} onClose={onClose} />
            </div>
        </div>
    );
};
