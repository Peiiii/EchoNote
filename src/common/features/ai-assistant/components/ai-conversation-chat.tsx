import { useConversationMessages } from "@/common/features/ai-assistant/hooks/use-conversation-messages";
import {
  isTempConversation,
  useConversationStore,
} from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import {
  AgentChatCore,
  UIMessage,
  useAgentSessionManager,
  useAgentSessionManagerState,
  useParseTools,
} from "@agent-labs/agent-chat";
import { useMemoizedFn } from "ahooks";
import { isEqual } from "lodash-es";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { debounceTime, distinctUntilChanged, groupBy, map, mergeMap } from "rxjs";
import { createModelSelectorExtension } from "../extensions/model-selector-extension";
import { aiAgentFactory } from "../services/ai-agent-factory";
import { ConversationChatProps } from "../types/conversation.types";

export function AIConversationChat({ conversationId, channelId }: ConversationChatProps) {
  const { userId: _userId } = useNotesDataStore();
  const { messages, createMessage, updateMessage, loading } =
    useConversationMessages(conversationId);
  const conv = useConversationStore(s => s.conversations.find(c => c.id === conversationId));
  const isBrandNewConversation = !!conv && conv.messageCount === 0;
  const showLoading = loading && !isBrandNewConversation;

  // const resetKey = useValueFromObservable(() => conversationId$.pipe(distinctUntilChanged((a, b) => isTempConversation(a) ? true : a === b)), conversationId);
  const lastConversationIdRef = useRef(conversationId);
  const resetKey = useMemo(() => {
    const lastConversationId = lastConversationIdRef.current;
    if (lastConversationId === conversationId) return;
    lastConversationIdRef.current = conversationId;
    if (isTempConversation(lastConversationId)) return lastConversationId;
    return conversationId;
  }, [conversationId])

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
            key={resetKey}
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

function AgentChatCoreWrapper({
  conversationId,
  channelId,
  messages,
  createMessage,
  updateMessage,
}: AgentChatCoreWrapperProps) {
  const agent = useMemo(() => aiAgentFactory.getAgent(), []);
  const tools = useMemo(() => {
    return aiAgentFactory.getChannelTools();
  }, []);
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);

  const agentSessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: () => aiAgentFactory.getSessionContexts(conversationId, channelId),
    initialMessages: messages,
    getToolExecutor: (name: string) => toolExecutors[name],
  });

  const memoizedCreateMessage = useMemoizedFn(createMessage);
  const memoizedUpdateMessage = useMemoizedFn(updateMessage);

  useEffect(() => {
    const sub = agentSessionManager.addMessagesEvent$.subscribe(({ messages }) => {
      messages.forEach(async m => {
        memoizedCreateMessage(m);
      });
    });
    return () => sub.unsubscribe();
  }, [agentSessionManager.addMessagesEvent$, memoizedCreateMessage]);

  useEffect(() => {
    const sub = agentSessionManager.updateMessageEvent$
      .pipe(
        map(({ message }) => message),
        groupBy(message => message.id),
        mergeMap(group =>
          group.pipe(
            debounceTime(300),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr))
          )
        )
      )
      .subscribe(message => {
        memoizedUpdateMessage(message);
      });

    return () => sub.unsubscribe();
  }, [agentSessionManager.updateMessageEvent$, memoizedUpdateMessage]);

  useEffect(() => {
    const sub = agentSessionManager.messages$.pipe(debounceTime(100)).subscribe(arr => {
      useConversationStore.getState().onMessagesSnapshot(conversationId, arr);
    });
    return () => sub.unsubscribe();
  }, [agentSessionManager, conversationId]);

  const inputExtensions = useMemo(
    () => [
      createModelSelectorExtension({
        onModelChange: (modelId: string) => {
          console.log("Model changed to:", modelId);
        },
      }),
    ],
    []
  );

  const { messages: _messages } = useAgentSessionManagerState(agentSessionManager);

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
              agentSessionManager.handleAddMessages([
                {
                  id: crypto.randomUUID(),
                  role: "user",
                  parts: [
                    {
                      type: "text",
                      text: prompt,
                    },
                  ],
                },
              ]);
            },
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
    },
  ];
}
