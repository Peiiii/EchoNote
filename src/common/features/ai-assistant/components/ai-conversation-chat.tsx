import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { useConversationMessages } from "@/common/features/ai-assistant/hooks/use-conversation-messages";
import {
  isTempConversation,
  useConversationStore,
} from "@/common/features/ai-assistant/stores/conversation.store";
import {
  AgentChatCore,
  UIMessage,
  useAgentSessionManager,
  useAgentSessionManagerState,
  useParseTools,
} from "@agent-labs/agent-chat";
import { useMemoizedFn } from "ahooks";
import { isEqual } from "lodash-es";
import { useEffect, useMemo, useRef } from "react";
import { debounceTime, distinctUntilChanged, groupBy, map, mergeMap } from "rxjs";
import { createModelSelectorExtension } from "../extensions/model-selector-extension";
import { createContextSelectorExtension } from "../extensions/context-selector-extension";
import { aiAgentFactory } from "../services/ai-agent-factory";
import { ConversationChatProps } from "../types/conversation.types";
import { AIConversationSkeleton } from "./ai-conversation-skeleton";

export function AIConversationChat({ conversationId, channelId }: ConversationChatProps) {
  const { messages, createMessage, updateMessage, loading } =
    useConversationMessages(conversationId);
  const conv = useConversationStore(s => s.conversations.find(c => c.id === conversationId));
  const allConversations = useConversationStore(s => s.conversations);
  const isBrandNewConversation = !!conv && conv.messageCount === 0;
  const isFirstConversation = allConversations.filter(c => !c.id.startsWith("temp-")).length === 1 && isBrandNewConversation;
  const showLoading = loading && !isBrandNewConversation;

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
          <AIConversationSkeleton />
        ) : (
          <AgentChatCoreWrapper
            key={resetKey}
            conversationId={conversationId}
            channelId={channelId}
            messages={messages}
            createMessage={createMessage}
            updateMessage={updateMessage}
            isFirstConversation={isFirstConversation}
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
  isFirstConversation: boolean;
}

function AgentChatCoreWrapper({
  conversationId,
  channelId,
  messages,
  createMessage,
  updateMessage,
  isFirstConversation,
}: AgentChatCoreWrapperProps) {
  const { isMobile } = useBreakpoint();
  const agent = useMemo(() => aiAgentFactory.getAgent(), []);
  const tools = useMemo(() => {
    return aiAgentFactory.getChannelTools();
  }, []);
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);

  const getContextsWithFirstSessionInfo = useMemo(() => {
    return () => {
      const baseContexts = aiAgentFactory.getSessionContexts(conversationId, channelId);

      if (isFirstConversation) {
        return [
          {
            description: "Product Information & First Session Guide",
            value: JSON.stringify({
              welcomeMessage: "This is the user's first AI conversation. Please DEMONSTRATE your agent capabilities by actively using tools to show what you can do.",
              productInfo: {
                name: "StillRoot",
                purpose: "A personal growth companion platform that helps users become who they want to be",
                coreFeatures: [
                  "Personal Growth Guidance: Monitor progress, identify problems in thinking and behavior, provide specific improvement suggestions",
                  "Deep Understanding: Help users dig deeper from surface phenomena to underlying essence and patterns",
                  "Insight Discovery: Analyze connections between notes, discover knowledge blind spots, provide new insights",
                  "Note Management: Create, read, update, and organize notes across channels with AI assistance"
                ],
                valueProposition: "StillRoot helps users track thoughts, discover patterns, and grow personally through AI-powered analysis of their notes and ideas.",
                mission: "Help users become who they want to be through cognitive enhancement and personal growth supervision"
              },
              engagementStrategy: "Be enthusiastic, show value by USING TOOLS, demonstrate capabilities, and encourage exploration. Make them feel excited about using StillRoot regularly.",
              demonstrationRequirements: [
                "You MUST actively use at least 2-3 tools to demonstrate your capabilities",
                "Use listNotes to show you can access their notes and provide insights",
                "Use grepNotes to search their notes and find patterns or interesting content",
                "Analyze their notes to provide meaningful insights",
                "Show excitement about their data and suggest ways to explore it",
                "CRITICAL: Call tools ONE AT A TIME. Wait for each tool to complete before calling the next one. Do not send multiple tool calls in parallel.",
                "For example, first call listNotes, wait for results, then call grepNotes, wait for results, then analyze"
              ],
              suggestedApproach: [
                "Greet them warmly as their personal growth companion",
                "Briefly introduce StillRoot's mission and your role",
                "IMMEDIATELY start using tools (listNotes, grepNotes, etc.) to demonstrate your capabilities",
                "Show actual insights from their notes, even if they're just starting out",
                "Highlight the value of having AI-powered analysis of their thoughts",
                "Invite them to try asking questions or exploring specific topics",
                "Be encouraging and show enthusiasm about helping them grow"
              ]
            }),
          },
          ...baseContexts,
        ];
      }
      return baseContexts;
    };
  }, [conversationId, channelId, isFirstConversation]);

  const initialMessagesWithWelcome = useMemo(() => {
    if (isFirstConversation && !isTempConversation(conversationId) && messages.length === 0) {
      const welcomePrompt: UIMessage = {
        id: `welcome-${conversationId}`,
        role: "user",
        parts: [
          {
            type: "text",
            text: "Hi! I'm new here. Could you please introduce yourself and explain what you can do to help me?",
          },
        ],
      };
      return [welcomePrompt];
    }
    return messages;
  }, [isFirstConversation, conversationId, messages]);

  const agentSessionManager = useAgentSessionManager({
    agent,
    getToolDefs: () => toolDefs,
    getContexts: getContextsWithFirstSessionInfo,
    initialMessages: initialMessagesWithWelcome,
    getToolExecutor: (name: string) => toolExecutors[name],
  });

  const welcomeMessageSentRef = useRef(false);

  useEffect(() => {
    if (isFirstConversation) {
      if (!welcomeMessageSentRef.current) {
        welcomeMessageSentRef.current = true;
        agentSessionManager.runAgent();
      }
    }
  }, [isFirstConversation, conversationId, agentSessionManager]);

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
      createContextSelectorExtension({
        conversationId,
        fallbackChannelId: channelId,
        showModeNameInCompact: !isMobile,
      }),
      createModelSelectorExtension({
        onModelChange: (modelId: string) => {
          console.log("Model changed to:", modelId);
        },
      }),
    ],
    [conversationId, channelId, isMobile]
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
      prompt: "Analyze my recent notes",
    },
    {
      id: "prompt-2",
      prompt: "Summarize my thoughts",
    },
    {
      id: "prompt-3",
      prompt: "What patterns do you see?",
    },
    {
      id: "prompt-4",
      prompt: "Help me organize these ideas",
    },
    {
      id: "prompt-5",
      prompt: "What am I missing?",
    },
    {
      id: "prompt-6",
      prompt: "Suggest improvements",
    },
  ];
}
