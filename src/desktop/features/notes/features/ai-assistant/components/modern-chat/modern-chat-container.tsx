import { ExperimentalInBrowserAgent } from "@/common/lib/runnable-agent/experimental-inbrowser-agent";
import { AIConversationMessage } from "@/common/types/ai-conversation";
import { getLLMProviderConfig } from "@/core/services/ai.service";
import { useAIConversationStore } from "@/core/stores/ai-conversation.store";
import { useAIMessageStore } from "@/core/stores/ai-message.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { IAgent, useAgentChat } from "@agent-labs/agent-chat";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { ModernChatInputBar } from "./modern-chat-input-bar";
import { ModernChatMessageList } from "./modern-chat-message-list";
import { ModernChatTopBar } from "./modern-chat-top-bar";

export interface ModernChatContainerProps {
    conversationId?: string;
    channelId?: string;
    className?: string;
    onClear?: () => void;
    onMessageSent?: (message: AIConversationMessage) => void;
}

export interface ModernChatContainerRef {
    addMessages: (messages: any[], options?: {
        triggerAgent?: boolean;
    }) => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    reset: () => void;
}

export const ModernChatContainer = forwardRef<
    ModernChatContainerRef,
    ModernChatContainerProps
>(function ModernChatContainer(
    { conversationId, className, onClear, onMessageSent },
    ref
) {
  // State
  const [input, setInput] = useState("");
  const { userId } = useNotesDataStore();
  const { getCurrentConversation } = useAIConversationStore();
  const { addMessage: addAIMessage } = useAIMessageStore();
  
  // Track saved messages to prevent duplicate saves
  const savedMessageIds = useRef<Set<string>>(new Set());

    // Get current conversation for context
    const currentConversation = conversationId ? getCurrentConversation() : null;

    // Create agent instance
    const { providerConfig } = getLLMProviderConfig();
    const agent: IAgent = useMemo(() => {
        return new ExperimentalInBrowserAgent({
            model: providerConfig.model,
            baseURL: providerConfig.baseUrl,
            apiKey: providerConfig.apiKey,
        });
    }, [providerConfig]);

    // Prepare contexts (currently not used but kept for future use)
    // const contexts: Context[] = useMemo(() => {
    //   const baseContexts: Context[] = [];
    //   
    //   // Add channel context if available
    //   if (channelId) {
    //     baseContexts.push({
    //       description: "Current Channel",
    //       value: `You are currently in channel: ${channelId}`
    //     });
    //   }
    //   
    //   // Add conversation context if available
    //   if (currentConversation) {
    //     baseContexts.push({
    //       description: "Conversation Context",
    //       value: `Current conversation: ${currentConversation.title} - ${currentConversation.description}`
    //     });
    //   }
    //   
    //   return baseContexts;
    // }, [channelId, currentConversation]);

  // Use agent chat hook
  const { 
    messages, 
    isAgentResponding, 
    addMessages, 
    sendMessage, 
    reset 
  } = useAgentChat({
    agent,
    toolDefs: [],
    initialMessages: [],
  });

  console.log("[ModernChatContainer] Messages:", messages);

  // Debug: Log messages changes
  useEffect(() => {
    console.log("[ModernChatContainer] Messages changed:", messages.length, "messages");
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log("[ModernChatContainer] Last message:", {
        id: lastMessage.id,
        role: lastMessage.role,
        content: lastMessage.content?.substring(0, 50) + "...",
        timestamp: (lastMessage as any).timestamp
      });
    }
  }, [messages]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        addMessages,
        sendMessage,
        reset,
    }), [addMessages, sendMessage, reset]);

  // Handle message sending
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !userId || !conversationId) return;

    try {
      console.log("[ModernChatContainer] Sending user message:", content);
      
      // Send message through agent chat
      await sendMessage(content);
      
      // Save user message to our message store for persistence
      const userMessage = await addAIMessage(userId, conversationId, {
        content: content.trim(),
        role: "user"
      });
      
      console.log("[ModernChatContainer] User message saved:", userMessage.id);
      onMessageSent?.(userMessage);
    } catch (error) {
      console.error("[ModernChatContainer] Failed to send message:", error);
    }
  };

    // Handle clear
    const handleClear = () => {
        reset();
        setInput("");
        if (onClear) onClear();
    };

  // Auto-save AI responses to message store
  useEffect(() => {
    if (userId && conversationId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && lastMessage.content) {
        // Check if this message is already saved using our ref
        const messageId = lastMessage.id || `${lastMessage.role}-${lastMessage.content}-${Date.now()}`;
        if (!savedMessageIds.current.has(messageId)) {
          savedMessageIds.current.add(messageId);
          console.log("[ModernChatContainer] Saving AI message:", messageId);
          addAIMessage(userId, conversationId, {
            content: lastMessage.content,
            role: "assistant"
          }).then((aiMessage) => {
            console.log("[ModernChatContainer] AI message saved:", aiMessage.id);
            onMessageSent?.(aiMessage);
          }).catch((error) => {
            console.error("[ModernChatContainer] Failed to save AI message:", error);
            // Remove from saved set on error so it can be retried
            savedMessageIds.current.delete(messageId);
          });
        } else {
          console.log("[ModernChatContainer] AI message already saved:", messageId);
        }
      }
    }
  }, [messages, userId, conversationId]);

    return (
        <div
            className={`w-full h-full flex flex-col bg-gradient-to-br from-indigo-50 to-white shadow-lg overflow-hidden transition-all duration-300 ${className ?? ""
                }`}
            style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
                boxShadow: "0 4px 24px 0 rgba(99,102,241,0.08)",
            }}
        >
            {/* Top Bar */}
            <ModernChatTopBar
                conversationTitle={currentConversation?.title || "AI Chat"}
                onClear={handleClear}
                onSettings={() => {
                    // TODO: Implement settings panel
                    console.log("Settings clicked");
                }}
            />

            {/* Message List */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <ModernChatMessageList
                    messages={messages}
                    isResponding={isAgentResponding}
                    onPreviewHtml={(html) => {
                        // TODO: Implement HTML preview
                        console.log("Preview HTML:", html);
                    }}
                />
            </div>

            {/* Input Bar */}
            <ModernChatInputBar
                value={input}
                onChange={setInput}
                onSend={async () => {
                    if (!input.trim()) return;
                    await handleSendMessage(input);
                    setInput("");
                }}
                disabled={isAgentResponding}
            />
        </div>
    );
});
