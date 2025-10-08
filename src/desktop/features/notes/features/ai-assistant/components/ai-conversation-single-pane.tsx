import { forwardRef, useImperativeHandle } from "react";
import { AIConversationList } from "@/common/features/ai-assistant/components/ai-conversation-list";
import { ConversationContent } from "@/common/features/ai-assistant/components/conversation-content";
import { ConversationPaneProps, SinglePaneRef } from "@/common/features/ai-assistant/types/conversation.types";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";

export type { SinglePaneRef };

export const AIConversationSinglePane = forwardRef<SinglePaneRef, ConversationPaneProps>(function AIConversationSinglePane({ 
  conversations, 
  currentConversationId, 
  loading, 
  channelId, 
  onClose 
}, ref) {
  const view = useConversationStore(s => s.uiView);
  const showList = useConversationStore(s => s.showList);
  const showChat = useConversationStore(s => s.showChat);
  const hasConversations = conversations.length > 0;

  useImperativeHandle(ref, () => ({
    showList: () => showList(),
    showChat: () => showChat(),
  }), [showList, showChat]);

  

  return (
    <div className="relative flex-1">
      <div className={"absolute inset-0 flex flex-col " + (view === "list" ? "" : "hidden")}>
        <AIConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          withHeader={false}
        />
      </div>
      <div className={"absolute inset-0 flex flex-col " + (view === "chat" ? "" : "hidden")}>
        <ConversationContent
          currentConversationId={currentConversationId}
          channelId={channelId}
          hasConversations={hasConversations}
          onClose={onClose}
        />
      </div>
    </div>
  );
});
