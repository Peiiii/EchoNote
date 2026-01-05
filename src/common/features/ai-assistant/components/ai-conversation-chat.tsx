import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { useConversationMessages } from "@/common/features/ai-assistant/hooks/use-conversation-messages";
import {
  isTempConversation,
  useConversationStore,
} from "@/common/features/ai-assistant/stores/conversation.store";
import {
  UIMessage,
  AgentChat,
  useAgentChatController,
  useParseTools,
} from "@agent-labs/agent-chat";
import { useMemoizedFn } from "ahooks";
import { isEqual } from "lodash-es";
import { useEffect, useMemo, useRef } from "react";
import { debounceTime, distinctUntilChanged, groupBy, map, mergeMap } from "rxjs";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const agent = useMemo(() => aiAgentFactory.getAgent(), []);
  const tools = useMemo(() => {
    return aiAgentFactory.getChannelTools();
  }, []);
  const { toolDefs, toolExecutors, toolRenderers } = useParseTools(tools);

  const getContexts = useMemo(() => {
    return () => {
      const baseContexts = aiAgentFactory.getSessionContexts(conversationId, channelId);

      if (!isFirstConversation) return baseContexts;

      return [
        {
          description: "Product Information & First Session Guide",
          value: JSON.stringify({
            welcomeMessage:
              "This is the user's first AI conversation. Please DEMONSTRATE your agent capabilities by actively using tools to show what you can do.",
            productInfo: {
              name: "StillRoot",
              purpose:
                "A personal growth companion platform that helps users become who they want to be",
              coreFeatures: [
                "Personal Growth Guidance: Monitor progress, identify problems in thinking and behavior, provide specific improvement suggestions",
                "Deep Understanding: Help users dig deeper from surface phenomena to underlying essence and patterns",
                "Insight Discovery: Analyze connections between notes, discover knowledge blind spots, provide new insights",
                "Note Management: Create, read, update, and organize notes across channels with AI assistance",
              ],
              valueProposition:
                "StillRoot helps users track thoughts, discover patterns, and grow personally through AI-powered analysis of their notes and ideas.",
              mission:
                "Help users become who they want to be through cognitive enhancement and personal growth supervision",
            },
            engagementStrategy:
              "Be enthusiastic, show value by USING TOOLS, demonstrate capabilities, and encourage exploration. Make them feel excited about using StillRoot regularly.",
            demonstrationRequirements: [
              "You MUST actively use at least 2-3 tools to demonstrate your capabilities",
              "Use listNotes to show you can access their notes and provide insights",
              "Use grepNotes to search their notes and find patterns or interesting content",
              "Analyze their notes to provide meaningful insights",
              "Show excitement about their data and suggest ways to explore it",
              "CRITICAL: Call tools ONE AT A TIME. Wait for each tool to complete before calling the next one. Do not send multiple tool calls in parallel.",
              "For example, first call listNotes, wait for results, then call grepNotes, wait for results, then analyze",
            ],
            suggestedApproach: [
              "Greet them warmly as their personal growth companion",
              "Briefly introduce StillRoot's mission and your role",
              "IMMEDIATELY start using tools (listNotes, grepNotes, etc.) to demonstrate your capabilities",
              "Show actual insights from their notes, even if they're just starting out",
              "Highlight the value of having AI-powered analysis of their thoughts",
              "Invite them to try asking questions or exploring specific topics",
              "Be encouraging and show enthusiasm about helping them grow",
            ],
          }),
        },
        ...baseContexts,
      ];
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
            text: t("aiAssistant.prompts.firstConversationWelcome"),
          },
        ],
      };
      return [welcomePrompt];
    }
    return messages;
  }, [isFirstConversation, conversationId, messages, t]);

  const agentChatController = useAgentChatController({
    agent,
    getToolDefs: () => toolDefs,
    getContexts,
    initialMessages: initialMessagesWithWelcome,
    getToolExecutor: (name: string) => toolExecutors[name],
  });

  const welcomeMessageSentRef = useRef(false);

  useEffect(() => {
    if (isFirstConversation) {
      if (!welcomeMessageSentRef.current) {
        welcomeMessageSentRef.current = true;
        agentChatController.runAgent();
      }
    }
  }, [isFirstConversation, conversationId, agentChatController]);

  const memoizedCreateMessage = useMemoizedFn(createMessage);
  const memoizedUpdateMessage = useMemoizedFn(updateMessage);

  useEffect(() => {
    const sub = agentChatController.addMessagesEvent$.subscribe(({ messages: nextMessages }) => {
      nextMessages.forEach(async m => {
        await memoizedCreateMessage(m);
      });
    });
    return () => sub.unsubscribe();
  }, [agentChatController.addMessagesEvent$, memoizedCreateMessage]);

  useEffect(() => {
    const sub = agentChatController.updateMessageEvent$
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
        memoizedUpdateMessage(message).catch(() => {});
      });

    return () => sub.unsubscribe();
  }, [agentChatController.updateMessageEvent$, memoizedUpdateMessage]);

  useEffect(() => {
    const sub = agentChatController.messages$.pipe(debounceTime(100)).subscribe(nextMessages => {
      useConversationStore.getState().onMessagesSnapshot(conversationId, nextMessages);
    });
    return () => sub.unsubscribe();
  }, [agentChatController, conversationId]);

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

  const channelPrompts = useMemo(() => {
    return [
      {
        id: "prompt-1",
        prompt: t("aiAssistant.prompts.defaultPrompts.analyzeNotes"),
      },
      {
        id: "prompt-2",
        prompt: t("aiAssistant.prompts.defaultPrompts.summarizeThoughts"),
      },
      {
        id: "prompt-3",
        prompt: t("aiAssistant.prompts.defaultPrompts.findPatterns"),
      },
      {
        id: "prompt-4",
        prompt: t("aiAssistant.prompts.defaultPrompts.organizeIdeas"),
      },
      {
        id: "prompt-5",
        prompt: t("aiAssistant.prompts.defaultPrompts.whatMissing"),
      },
      {
        id: "prompt-6",
        prompt: t("aiAssistant.prompts.defaultPrompts.suggestImprovements"),
      },
    ];
  }, [t]);

  return (
    <div className="h-full flex flex-col agent-chat-fullwidth">
      <div className="flex-1 min-h-0">
        <AgentChat
          agentChatController={agentChatController}
          toolRenderers={toolRenderers}
          className="h-full w-full"
          messageItemProps={{
            showAvatar: false,
          }}
          promptsProps={{
            items: channelPrompts,
            onItemClick: ({ prompt }) => {
              agentChatController
                .handleAddMessages(
                  [
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
                  ],
                  { triggerAgent: true }
                )
                .catch(() => {});
            },
          }}
          inputExtensions={inputExtensions}
        />
      </div>
    </div>
  );
}
