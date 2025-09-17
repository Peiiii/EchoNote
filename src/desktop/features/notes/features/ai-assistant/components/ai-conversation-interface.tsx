import { useEffect, useRef, useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useAIConversation } from "@/common/hooks/use-ai-conversation";
import { AIConversationChat } from "./ai-conversation-chat";
import { useContainerMode } from "@/common/hooks/use-container-mode";
import { AIConversationList } from "./ai-conversation-list";
// 不使用全局 Drawer，避免脱离容器；采用容器内视图切换

interface AIConversationInterfaceProps {
  channelId: string;
  onClose?: () => void;
}

// 小工具：根据容器宽度切换两栏/单栏模式由公共 hook 提供

export function AIConversationInterface({ channelId, onClose }: AIConversationInterfaceProps) {
  const { userId } = useNotesDataStore();
  const { 
    conversations,
    currentConversation,
    currentConversationId, 
    loading, 
    createConversation, 
    loadConversations, 
    selectConversation 
  } = useAIConversation();

  const containerRef = useRef<HTMLDivElement>(null);
  // 320(侧栏) + 520(聊天最小宽度) 的经验阈值；如需调整可通过 opts 修改
  const mode = useContainerMode(containerRef, { sidebar: 320, chatMin: 520 });
  const isSinglePane = mode === "single-pane";
  // 单栏模式：在容器内切换“列表视图/聊天视图”
  const [showList, setShowList] = useState(false);
  useEffect(() => {
    if (isSinglePane) {
      setShowList(!currentConversationId); // 无选中会话则显示列表
    }
  }, [isSinglePane, currentConversationId]);
  
  // 加载对话列表
  useEffect(() => {
    if (userId) {
      loadConversations(userId, channelId);
    }
  }, [userId, channelId, loadConversations]);
  
  const handleCreateConversation = async () => {
    if (!userId) return;
    await createConversation(userId, channelId, "New Conversation");
    // 单栏模式：新建后切到聊天视图
    if (isSinglePane) setShowList(false);
  };
  
  return (
    <div ref={containerRef} className="h-full flex">
      {/* 左侧列表：仅双栏模式显示 */}
      {mode === "two-pane" && (
        <div className="w-80 border-r border-border flex flex-col">
          <AIConversationList
            conversations={conversations}
            currentConversationId={currentConversationId}
            loading={loading}
            onCreate={handleCreateConversation}
            onSelect={(id) => selectConversation(id)}
            withHeader
          />
        </div>
      )}

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 单栏模式顶栏：历史按钮(切换列表) + 标题 + 新建 */}
        {mode === "single-pane" && (
          <div className="h-12 flex items-center justify-between border-b border-border px-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowList(true)}
              aria-label="Show conversation list"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            <div className="text-sm font-medium truncate">
              {currentConversation?.title || "AI Conversations"}
            </div>
            <Button size="sm" onClick={handleCreateConversation}>
              <Plus className="w-4 h-4 mr-1" /> 新建
            </Button>
          </div>
        )}

        {/* 单栏模式：容器内切换列表/聊天；双栏模式：右侧直接显示聊天 */}
        {isSinglePane ? (
          <div className="relative flex-1">
            {/* 列表视图 */}
            <div className={"absolute inset-0 flex flex-col " + (showList ? "" : "hidden")}>
              <AIConversationList
                conversations={conversations}
                currentConversationId={currentConversationId}
                loading={loading}
                onCreate={handleCreateConversation}
                onSelect={(id) => { selectConversation(id); setShowList(false); }}
                withHeader={false}
              />
            </div>
            {/* 聊天视图 */}
            <div className={"absolute inset-0 flex flex-col " + (showList ? "hidden" : "")}>
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
        ) : (
          currentConversationId ? (
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
          )
        )}
      </div>
    </div>
  );
}
