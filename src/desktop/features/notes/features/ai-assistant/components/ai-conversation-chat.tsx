import { Button } from "@/common/components/ui/button";
import { aiAgentFactory } from "@/common/features/notes/services/ai-agent-factory";
import { useAIConversation } from "@/common/hooks/use-ai-conversation";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { AgentChatCore, useAgentSessionManager, useParseTools, UIMessage } from "@agent-labs/agent-chat";
import { X, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { debounceTime } from "rxjs";
import { useAgentChatSync } from "../hooks/use-agent-chat-sync";

interface AIConversationChatProps {
  conversationId: string;
  channelId: string;
  onClose?: () => void;
}

export function AIConversationChat({
  conversationId,
  channelId,
  onClose
}: AIConversationChatProps) {
  const { userId: _userId } = useNotesDataStore();

  // 消息同步 Hook
  const { messages, addMessage, loading } = useAgentChatSync(conversationId, channelId);

  // 获取当前对话信息
  const { currentConversation } = useAIConversation();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* 对话头部 */}
      <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {currentConversation?.title || "AI Conversation"}
          </h3>
          <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            {channelId}
          </span>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* 聊天界面 - 等待消息加载完成 */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading conversation...</span>
            </div>
          </div>
        ) : (
          <AgentChatCoreWrapper
            conversationId={conversationId}
            channelId={channelId}
            messages={messages}
            addMessage={addMessage}
          />
        )}
      </div>
    </div>
  );
}

// AgentChatCore 包装组件 - 只在消息加载完成后渲染
interface AgentChatCoreWrapperProps {
  conversationId: string;
  channelId: string;
  messages: UIMessage[];
  addMessage: (message: UIMessage) => Promise<void>;
}

function AgentChatCoreWrapper({
  conversationId: _conversationId,
  channelId,
  messages,
  addMessage
}: AgentChatCoreWrapperProps) {
  // 获取 Agent 配置
  const agent = useMemo(() => aiAgentFactory.createAgent(), []);
  const tools = useMemo(() => aiAgentFactory.getChannelTools(channelId), [channelId]);
  const contexts = useMemo(() => aiAgentFactory.getChannelContext(channelId), [channelId]);

  // 解析工具
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);

  // 创建 AgentSessionManager - 只在消息加载完成后创建
  const agentSessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: () => contexts,
    initialMessages: messages, // 确保使用已加载的消息
    getToolExecutor: (name: string) => toolExecutors[name],
  });

  // 监听消息变化并同步到 Firebase
  useEffect(() => {
    const subscription = agentSessionManager.messages$.pipe(
      debounceTime(1000)
    ).subscribe(async (newMessages) => {
      // 同步所有消息到 Firebase，包括更新已存在的消息
      for (const message of newMessages) {
        if (!message.id.startsWith('temp-')) {
          console.log("[AgentChatCoreWrapper] before addMessage", message);
          await addMessage(message);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [agentSessionManager, addMessage]);

  return (
    <AgentChatCore
      agentSessionManager={agentSessionManager}
      toolRenderers={toolRenderers}
      className="h-full w-full"
      messageItemProps={{
        showAvatar: false,
      }}
      promptsProps={{
        items: getChannelPrompts(channelId),
        onItemClick: ({ prompt }) => {
          agentSessionManager.handleAddMessages([{
            id: crypto.randomUUID(),
            role: "user",
            parts: [{
              type: "text",
              text: prompt,
            }],
          }]);
        }
      }}
    />
  );
}

// 获取频道相关的提示词
function getChannelPrompts(_channelId: string) {
  return [
    {
      id: "prompt-1",
      prompt: "聊聊吧",
    },
    {
      id: "prompt-2",
      prompt: "帮我总结一下",
    },
    {
      id: "prompt-3",
      prompt: "你有啥建议吗",
    },
    {
      id: "prompt-4",
      prompt: "我接下来该做什么呢？",
    },
    {
      id: "prompt-5",
      prompt: "有什么很重要但是被我忽略的东西？",
    },
    {
      id: "prompt-6",
      prompt: "接下来一周的建议",
    }
  ];
}
