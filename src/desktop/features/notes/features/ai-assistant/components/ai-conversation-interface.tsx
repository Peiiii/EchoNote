import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useAIConversation } from "@/common/hooks/use-ai-conversation";
import { AIConversationChat } from "./ai-conversation-chat";
import { useContainerMode } from "@/common/hooks/use-container-mode";
import { AIConversationList } from "./ai-conversation-list";

interface AIConversationInterfaceProps {
  channelId: string;
  onClose?: () => void;
}

export type AIConversationInterfaceRef = {
  showList: () => void;
  showChat: () => void;
  createNew: () => void;
  isSinglePane: () => boolean;
};

export const AIConversationInterface = forwardRef<AIConversationInterfaceRef, AIConversationInterfaceProps>(function AIConversationInterface({ channelId, onClose }, ref) {
  const { userId } = useNotesDataStore();
  const { 
    conversations,
    currentConversationId, 
    loading, 
    createConversation, 
    loadConversations, 
    selectConversation 
  } = useAIConversation();

  const containerRef = useRef<HTMLDivElement>(null);
  const { mode, ready } = useContainerMode(containerRef, { sidebar: 320, chatMin: 520 });
  const isSinglePane = mode === "single-pane";
  const [showList, setShowList] = useState(false);
  const hasConversations = conversations.length > 0;
  useEffect(() => {
    setShowList(isSinglePane ? !hasConversations : false);
  }, [isSinglePane, hasConversations]);
  useImperativeHandle(ref, () => ({
    showList: () => setShowList(true),
    showChat: () => setShowList(false),
    createNew: () => handleCreateConversation(),
    isSinglePane: () => isSinglePane,
  }), [isSinglePane]);
  
  useEffect(() => {
    if (userId) {
      loadConversations(userId, channelId);
    }
  }, [userId, channelId, loadConversations]);
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      selectConversation(conversations[0].id);
    }
  }, [conversations, currentConversationId, selectConversation]);
  
  const handleCreateConversation = async () => {
    if (!userId) return;
    await createConversation(userId, channelId, "New Conversation");
    if (isSinglePane) setShowList(false);
  };
  
  if (loading) {
    return (
      <div ref={containerRef} className={"h-full flex " + (ready ? "" : "invisible") }>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={"h-full flex " + (ready ? "" : "invisible") }>
      {mode === "two-pane" && (
        <div className="w-80 flex flex-col">
          <AIConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            loading={loading}
            onSelect={(id) => selectConversation(id)}
            withHeader={false}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {isSinglePane ? (
          <div className="relative flex-1">
            <div className={"absolute inset-0 flex flex-col " + (showList ? "" : "hidden")}>
              <AIConversationList
                conversations={conversations}
                currentConversationId={currentConversationId}
                loading={loading}
                onSelect={(id) => { selectConversation(id); setShowList(false); }}
                withHeader={false}
              />
            </div>
            <div className={"absolute inset-0 flex flex-col " + (showList ? "hidden" : "")}>
              {currentConversationId ? (
                <AIConversationChat 
                  conversationId={currentConversationId}
                  channelId={channelId}
                  onClose={onClose}
                />
              ) : (
                hasConversations ? (
                  <div className="flex-1" />
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
                )
              )}
            </div>
          </div>
        ) : (
          currentConversationId ? (
            <AIConversationChat 
              conversationId={currentConversationId}
              channelId={channelId}
              onClose={onClose}
            />
          ) : (
            hasConversations ? (
              <div className="flex-1" />
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
            )
          )
        )}
      </div>
    </div>
  );
});
