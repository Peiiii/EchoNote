import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useAIConversation } from "@/common/features/ai-assistant/hooks/use-ai-conversation";
import { useContainerMode } from "@/common/hooks/use-container-mode";
import { AIConversationTwoPane } from "./ai-conversation-two-pane";
import { AIConversationSinglePane, SinglePaneRef } from "./ai-conversation-single-pane";

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
  const { mode, ready } = useContainerMode(containerRef, { sidebar: 320, chatMin: 520, hysteresis: 12, debounceMs: 80 });
  const isSinglePane = mode === "single-pane";
  
  const singleRef = useRef<SinglePaneRef>(null);
  useImperativeHandle(ref, () => ({
    showList: () => singleRef.current?.showList(),
    showChat: () => singleRef.current?.showChat(),
    createNew: () => handleCreateConversation(),
    isSinglePane: () => isSinglePane,
  }), [isSinglePane]);

  useEffect(() => {
    if (userId) {
      loadConversations(userId, channelId);
    }
  }, [userId, channelId, loadConversations]);


  const handleCreateConversation = async () => {
    if (!userId) return;
    await createConversation(userId, channelId, "New Conversation");
    
  };


  if (loading||!ready) {
    return (
      <div ref={containerRef} className={"h-full flex " + (ready ? "" : "invisible")}>
        <LoaderPane />
      </div>
    );
  }
  return (
    <div ref={containerRef} className={"h-full flex " + (ready ? "" : "invisible")}>
      {mode === "two-pane" ? (
        <AIConversationTwoPane
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          onSelect={(id) => selectConversation(id)}
          onCreate={handleCreateConversation}
          channelId={channelId}
          onClose={onClose}
        />
      ) : (
        <AIConversationSinglePane
          ref={singleRef}
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          onSelect={(id) => selectConversation(id)}
          onCreate={handleCreateConversation}
          channelId={channelId}
          onClose={onClose}
        />
      )}
    </div>
  );
});

function LoaderPane() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
    </div>
  );
}

 
