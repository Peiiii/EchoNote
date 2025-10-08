


import { useConversationMessages } from "@/common/features/ai-assistant/hooks/use-conversation-messages";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useCollectionDiff } from "@/common/lib/use-collection-diff";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { AgentChatCore, UIMessage, useAgentSessionManager, useAgentSessionManagerState, useParseTools } from "@agent-labs/agent-chat";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { debounceTime } from "rxjs";
import { createModelSelectorExtension } from "../extensions/model-selector-extension";
import { aiAgentFactory } from "../services/ai-agent-factory";

import { safeHashMessage } from "@/common/features/ai-assistant/utils/sanitize-ui-message";
import { ConversationChatProps } from "../types/conversation.types";
import { channelMessageService } from "@/core/services/channel-message.service";
import { sessionContextManager } from "../features/context/services/session-context-manager";

export function AIConversationChat({ conversationId, channelId }: ConversationChatProps) {
  const { userId: _userId } = useNotesDataStore();
  const { messages, createMessage, updateMessage, loading } = useConversationMessages(conversationId);
  const conv = useConversationStore(s => s.conversations.find(c => c.id === conversationId));
  const isBrandNewConversation = !!conv && (conv.messageCount === 0);
  const showLoading = loading && !isBrandNewConversation;
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 overflow-hidden">
        {showLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading conversation...</span>
            </div>
          </div>
        ) : (
          <AgentChatCoreWrapper
            key={conversationId}
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
  const agent = useMemo(() => aiAgentFactory.getAgent(), []);
  // Select tool target channel based on conversation contexts; fallback to current channel
  const conv = useConversationStore(s => s.conversations.find(c => c.id === conversationId));
  const initialToolChannel = useMemo(() => {
    if (conv?.contexts?.mode === 'channels' && conv.contexts.channelIds && conv.contexts.channelIds.length > 0) {
      return conv.contexts.channelIds[0];
    }
    return channelId;
  }, [conv?.contexts, channelId]);
  const [toolChannelId, setToolChannelId] = useState<string>(initialToolChannel);
  const tools = useMemo(() => {
    return aiAgentFactory.getChannelTools();
  }, []);
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);

  const agentSessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    // Dynamic contexts: use conversation-bound contexts when available; fallback to current channel
    getContexts: () => aiAgentFactory.getSessionContexts(conversationId, channelId),
    initialMessages: messages,
    getToolExecutor: (name: string) => toolExecutors[name],
  });
  const [sessionMessages, setSessionMessages] = useState<UIMessage[]>(messages);
  useEffect(() => {
    const sub = agentSessionManager.messages$.pipe(debounceTime(100)).subscribe((arr) => {
      setSessionMessages(arr);
      // Feed messages to store for auto-title evaluation (no AI call here; store handles policy)
      useConversationStore.getState().onMessagesSnapshot(conversationId, arr);
    });
    return () => sub.unsubscribe();
  }, [agentSessionManager, conversationId]);

  // Trigger loading for context data for current tool channel and explicit contexts (to improve first response quality)
  useEffect(() => {
    // Ensure tool channel is loaded
    const channelState = channelMessageService.dataContainer.get().messageByChannel[toolChannelId];
    if (!channelState) {
      channelMessageService.requestLoadInitialMessages$.next({ channelId: toolChannelId });
    }
    
    // Use centralized method to ensure context channels are loaded
    sessionContextManager.ensureContextsLoaded(conv?.contexts || null, channelId);
  }, [toolChannelId, conv?.contexts, channelId]);

  // Auto mode: when conversation has no explicit contexts, keep tool target in sync with current channel
  useEffect(() => {
    if (!conv || conv.contexts) return; // manual mode when contexts exists
    if (toolChannelId !== channelId) {
      setToolChannelId(channelId);
    }
  }, [conv, toolChannelId, channelId]);

  // When contexts change in manual mode, ensure tool target is valid
  useEffect(() => {
    if (!conv?.contexts) return; // auto mode handled above
    const mode = conv.contexts.mode;
    if (mode === 'channels') {
      const ids = conv.contexts.channelIds || [];
      if (!ids.includes(toolChannelId)) {
        setToolChannelId(ids[0] || channelId);
      }
    } else {
      // 'none' or 'all' -> default to current channel for tools
      if (toolChannelId !== channelId) setToolChannelId(channelId);
    }
  }, [conv?.contexts, toolChannelId, channelId]);

  // Use a safe hash that ignores functions/cycles inside tool parts
  const hash = (m: UIMessage) => safeHashMessage(m);
  useCollectionDiff<UIMessage>({
    items: sessionMessages,
    getId: (m) => (m.id ? m.id : null),
    hash,
    onAdd: async (m) => {
      console.log("[AgentChatCoreWrapper] onAdd", m);
      await createMessage(m);
    },
    onUpdate: async (m) => {
      console.log("[AgentChatCoreWrapper] onUpdate", m);
      await updateMessage(m);
    },
    resetKey: conversationId,
    debounceMs: 1000,
  });

  const { conversations } = useConversationState();
  const autoTitleDoneMap = useConversationStore(s => s.autoTitleDone);
  useEffect(() => {
    if (autoTitleDoneMap && autoTitleDoneMap[conversationId]) return;
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;
    // Ensure store sees initial static messages too
    useConversationStore.getState().onMessagesSnapshot(conversationId, sessionMessages);
  }, [conversations, sessionMessages, conversationId, autoTitleDoneMap]);

  const inputExtensions = useMemo(() => [
    createModelSelectorExtension({
      onModelChange: (modelId: string) => {
        console.log('Model changed to:', modelId);
      }
    })
  ], []);

  const { messages: _messages } = useAgentSessionManagerState(agentSessionManager)

  return (
    <div className="h-full flex flex-col agent-chat-fullwidth">
      <div className="flex-1 min-h-0">
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
          inputExtensions={inputExtensions}
        />
      </div>
    </div>
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
