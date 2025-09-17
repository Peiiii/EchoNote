import { aiAgentFactory } from "../services/ai-agent-factory";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { AgentChatCore, useAgentSessionManager, useParseTools, UIMessage } from "@agent-labs/agent-chat";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { debounceTime } from "rxjs";
import { useAgentChatSync } from "@/desktop/features/notes/features/ai-assistant/hooks/use-agent-chat-sync";

interface AIConversationChatProps {
  conversationId: string;
  channelId: string;
  onClose?: () => void;
}

export function AIConversationChat({ conversationId, channelId }: AIConversationChatProps) {
  const { userId: _userId } = useNotesDataStore();
  const { messages, addMessage, loading } = useAgentChatSync(conversationId, channelId);
  return (
    <div className="h-full flex flex-col bg-background">
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

interface AgentChatCoreWrapperProps {
  conversationId: string;
  channelId: string;
  messages: UIMessage[];
  addMessage: (message: UIMessage) => Promise<void>;
}

function AgentChatCoreWrapper({ conversationId: _conversationId, channelId, messages, addMessage }: AgentChatCoreWrapperProps) {
  const agent = useMemo(() => aiAgentFactory.createAgent(), []);
  const tools = useMemo(() => aiAgentFactory.getChannelTools(channelId), [channelId]);
  const contexts = useMemo(() => aiAgentFactory.getChannelContext(channelId), [channelId]);
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);
  const agentSessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: () => contexts,
    initialMessages: messages,
    getToolExecutor: (name: string) => toolExecutors[name],
  });
  useEffect(() => {
    const subscription = agentSessionManager.messages$.pipe(
      debounceTime(1000)
    ).subscribe(async (newMessages) => {
      for (const message of newMessages) {
        if (!message.id.startsWith('temp-')) {
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

function getChannelPrompts(_channelId: string) {
  return [
    {
      id: "prompt-1",
      prompt: "Let's chat",
    },
    {
      id: "prompt-2",
      prompt: "Summarize this",
    },
    {
      id: "prompt-3",
      prompt: "Any suggestions?",
    },
    {
      id: "prompt-4",
      prompt: "What should I do next?",
    },
    {
      id: "prompt-5",
      prompt: "What important thing am I missing?",
    },
    {
      id: "prompt-6",
      prompt: "Suggestions for next week",
    }
  ];
}
