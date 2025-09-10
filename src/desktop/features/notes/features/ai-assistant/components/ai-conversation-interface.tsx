import { Button } from "@/common/components/ui/button";
import { AIConversationMessage } from "@/common/types/ai-conversation";
import { useAIConversationStore } from "@/core/stores/ai-conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { MessageSquare, Plus, Settings, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ConversationChat } from "./conversation-chat/conversation-chat";
import { CompactConversationManager } from "./conversation-manager/compact-conversation-manager";

interface AIConversationInterfaceProps {
  channelId?: string;
  onClose?: () => void;
}

export function AIConversationInterface({
  channelId,
  onClose
}: AIConversationInterfaceProps) {
  const { 
    currentConversationId, 
    setCurrentConversation, 
    getCurrentConversation,
    createConversation,
    updateConversation,
    conversations
  } = useAIConversationStore();
  
  const { userId } = useNotesDataStore();
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const currentConversation = getCurrentConversation();

  // Show welcome message for first-time users
  useEffect(() => {
    if (conversations.length === 0 && !currentConversationId) {
      setShowWelcome(true);
    }
  }, [conversations.length, currentConversationId]);

  const handleCreateNewConversation = async () => {
    if (!userId || !channelId || isCreatingConversation) return;

    setIsCreatingConversation(true);
    try {
      const conversation = await createConversation(
        userId,
        channelId,
        "New Conversation",
        "Start a new AI conversation"
      );
      setCurrentConversation(conversation.id);
      setShowWelcome(false);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId);
  };

  const handleMessageSent = async (message: AIConversationMessage) => {
    console.log("Message sent:", message);
    
    // Update conversation last message time and message count
    if (currentConversation && userId) {
      try {
        await updateConversation(userId, currentConversation.id, {
          lastMessageAt: message.timestamp,
          messageCount: currentConversation.messageCount + 1
        });
        console.log("Conversation updated successfully");
      } catch (error) {
        console.error("Failed to update conversation:", error);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="border-b p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            <h2 className="text-sm font-semibold truncate">AI Chat</h2>
            {currentConversation && (
              <span className="text-xs text-muted-foreground truncate">
                - {currentConversation.title}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              onClick={handleCreateNewConversation}
              disabled={isCreatingConversation}
              size="sm"
              className="h-7 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              New
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline" size="sm" className="h-7 w-7 p-0">
                <Settings className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Compact Content - Split Layout */}
      <div className="flex-1 flex">
        <div className="w-64 border-r">
          <CompactConversationManager
            channelId={channelId}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={currentConversationId || undefined}
          />
        </div>

        <div className="flex-1 flex flex-col">
          {currentConversationId ? (
            <ConversationChat
              conversationId={currentConversationId}
              onMessageSent={handleMessageSent}
            />
          ) : showWelcome ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-xs">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Welcome!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start chatting with AI to get insights and ask questions.
                </p>
                <Button onClick={handleCreateNewConversation} disabled={isCreatingConversation} className="w-full h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Start First Chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <h3 className="text-sm font-medium mb-2">No chat selected</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Choose a conversation or create a new one
                </p>
                <Button onClick={handleCreateNewConversation} disabled={isCreatingConversation} size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  New Chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}