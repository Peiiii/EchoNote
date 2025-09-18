import { aiAgentFactory } from "../services/ai-agent-factory";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { AgentChatCore, useAgentSessionManager, useParseTools, UIMessage } from "@agent-labs/agent-chat";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { debounceTime } from "rxjs";
import { useCollectionDiff } from "@/common/lib/use-collection-diff";
import { useAIConversation } from "@/common/features/ai-assistant/hooks/use-ai-conversation";
import { useAgentChatSync } from "@/desktop/features/notes/features/ai-assistant/hooks/use-agent-chat-sync";

import { ConversationChatProps } from "../types/conversation.types";

export function AIConversationChat({ conversationId, channelId }: ConversationChatProps) {
  const { userId: _userId } = useNotesDataStore();
  const { messages, createMessage, updateMessage, loading } = useAgentChatSync(conversationId, channelId);
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
            createMessage={createMessage}
            updateMessage={updateMessage}
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
  createMessage: (message: UIMessage) => Promise<void>;
  updateMessage: (message: UIMessage) => Promise<void>;
}

function AgentChatCoreWrapper({ conversationId, channelId, messages, createMessage, updateMessage }: AgentChatCoreWrapperProps) {
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
  const [sessionMessages, setSessionMessages] = useState<UIMessage[]>(messages);
  useEffect(() => {
    const sub = agentSessionManager.messages$.pipe(debounceTime(100)).subscribe((arr) => {
      setSessionMessages(arr);
    });
    return () => sub.unsubscribe();
  }, [agentSessionManager]);

  const hash = (m: UIMessage) => JSON.stringify({ role: m.role, parts: m.parts });
  useCollectionDiff<UIMessage>({
    items: sessionMessages,
    getId: (m) => (m.id ? m.id : null),
    hash,
    onAdd: async (m) => { 
      console.log("[AgentChatCoreWrapper] onAdd", m);
      await createMessage(m); },
    onUpdate: async (m) => { 
      console.log("[AgentChatCoreWrapper] onUpdate", m);
      await updateMessage(m); },
    resetKey: conversationId,
    debounceMs: 1000,
  });

  const { conversations, updateConversation } = useAIConversation();
  useEffect(() => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;
    const defaultTitle = !conv.title || /^New Conversation/i.test(conv.title) || conv.title.startsWith('temp-');
    if (!defaultTitle) return;
    const firstUserText = sessionMessages.find(m => m.role === 'user')?.parts.find(p => p.type === 'text');
    const text = firstUserText?.text?.trim?.();
    if (!text) return;
    const title = text.replace(/\s+/g, ' ').slice(0, 36);
    if (title.length === 0) return;
    updateConversation?.(conv.userId, conversationId, { title });
  }, [conversations, sessionMessages, conversationId, updateConversation]);

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
