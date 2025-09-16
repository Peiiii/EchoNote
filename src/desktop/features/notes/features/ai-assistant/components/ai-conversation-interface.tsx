import { useEffect } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useAIConversation } from "@/common/hooks/use-ai-conversation";
import { AIConversationChat } from "./ai-conversation-chat";

interface AIConversationInterfaceProps {
  channelId: string;
  onClose?: () => void;
}

export function AIConversationInterface({ channelId, onClose }: AIConversationInterfaceProps) {
  const { userId } = useNotesDataStore();
  const { 
    conversations, 
    currentConversationId, 
    loading, 
    createConversation, 
    loadConversations, 
    selectConversation 
  } = useAIConversation();
  
  // 加载对话列表
  useEffect(() => {
    if (userId) {
      loadConversations(userId, channelId);
    }
  }, [userId, channelId, loadConversations]);
  
  const handleCreateConversation = async () => {
    if (!userId) return;
    await createConversation(userId, channelId, "New Conversation");
  };
  
  return (
    <div className="h-full flex">
      {/* 对话列表侧边栏 */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-lg font-semibold">AI Conversations</h2>
          </div>
          <Button onClick={handleCreateConversation} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No conversations yet
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`p-3 cursor-pointer hover:bg-accent border-b border-border ${
                  currentConversationId === conversation.id ? 'bg-accent' : ''
                }`}
                onClick={() => selectConversation(conversation.id)}
              >
                <div className="font-medium truncate">{conversation.title}</div>
                <div className="text-xs text-muted-foreground">
                  {conversation.messageCount} messages
                </div>
                <div className="text-xs text-muted-foreground">
                  {conversation.lastMessageAt.toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {currentConversationId ? (
          <AIConversationChat 
            conversationId={currentConversationId}
            channelId={channelId}
            onClose={onClose}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground mb-4">Create a new conversation to start chatting</p>
              <Button onClick={handleCreateConversation}>
                <Plus className="w-4 h-4 mr-2" />
                Create Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
