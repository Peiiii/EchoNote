import { forwardRef, useEffect, useImperativeHandle, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { useContainerMode } from "@/common/hooks/use-container-mode";
import { AIConversationTwoPane } from "./ai-conversation-two-pane";
import { AIConversationSinglePane, SinglePaneRef } from "./ai-conversation-single-pane";
import { ConversationInterfaceProps, ConversationInterfaceRef } from "@/common/features/ai-assistant/types/conversation.types";

export type AIConversationInterfaceRef = ConversationInterfaceRef;

export const AIConversationInterface = forwardRef<ConversationInterfaceRef, ConversationInterfaceProps>(function AIConversationInterface({ channelId, onClose }, ref) {
  const { userId } = useNotesDataStore();
  const {
    conversations,
    currentConversationId,
    loading,
    createConversation,
    loadConversations
  } = useConversationState();

  const containerRef = useRef<HTMLDivElement>(null);
  const { mode, ready } = useContainerMode(containerRef, { sidebar: 320, chatMin: 520, hysteresis: 12, debounceMs: 80 });
  const isSinglePane = mode === "single-pane";
  
  const singleRef = useRef<SinglePaneRef>(null);

  const handleCreateConversation = useCallback(() => {
    if (!userId) return;
    // MVP v1: conversations are global; default context is provided by UI (current channel)
    void createConversation(userId, "New Conversation");
  }, [userId, createConversation]);

  useImperativeHandle(ref, () => ({
    showList: () => singleRef.current?.showList(),
    showChat: () => singleRef.current?.showChat(),
    createNew: () => handleCreateConversation(),
    isSinglePane: () => isSinglePane,
  }), [isSinglePane, handleCreateConversation]);

  useEffect(() => {
    if (userId) {
      // Load global conversations (decoupled from channels)
      loadConversations(userId);
    }
  }, [userId, loadConversations]);


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
          channelId={channelId}
          onClose={onClose}
        />
      ) : (
        <AIConversationSinglePane
          ref={singleRef}
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
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

 
