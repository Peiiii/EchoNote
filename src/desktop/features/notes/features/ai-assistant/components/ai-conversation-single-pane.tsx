import { forwardRef, useImperativeHandle, useState } from "react";
import { AIConversationList } from "@/common/features/ai-assistant/components/ai-conversation-list";
import { ConversationContent } from "@/common/features/ai-assistant/components/conversation-content";
import { ConversationPaneProps, SinglePaneRef } from "@/common/features/ai-assistant/types/conversation.types";

export type { SinglePaneRef };

export const AIConversationSinglePane = forwardRef<SinglePaneRef, ConversationPaneProps>(function AIConversationSinglePane({ 
  conversations, 
  currentConversationId, 
  loading, 
  onSelect, 
  onDelete,
  onCreate, 
  channelId, 
  onClose 
}, ref) {
  const [view, setView] = useState<"list" | "chat">("chat");
  const hasConversations = conversations.length > 0;

  useImperativeHandle(ref, () => ({
    showList: () => setView("list"),
    showChat: () => setView("chat"),
  }), []);

  const handleSelect = (id: string) => {
    onSelect(id);
    setView("chat");
  };

  return (
    <div className="relative flex-1">
      <div className={"absolute inset-0 flex flex-col " + (view === "list" ? "" : "hidden")}>
        <AIConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          onSelect={handleSelect}
          onDelete={onDelete}
          withHeader={false}
        />
      </div>
      <div className={"absolute inset-0 flex flex-col " + (view === "chat" ? "" : "hidden")}>
        <ConversationContent
          currentConversationId={currentConversationId}
          channelId={channelId}
          hasConversations={hasConversations}
          onCreate={onCreate}
          onClose={onClose}
        />
      </div>
    </div>
  );
});
