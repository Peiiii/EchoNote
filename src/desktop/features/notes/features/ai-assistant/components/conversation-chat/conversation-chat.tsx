import { useState, useEffect, useRef, useMemo } from "react";
import { Send, Bot as BotIcon, User, Loader2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { useAIMessageStore } from "@/core/stores/ai-message.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { AIConversationMessage } from "@/common/types/ai-conversation";
import { format } from "date-fns";

interface ConversationChatProps {
  conversationId: string;
  onMessageSent?: (message: AIConversationMessage) => void;
}

export function ConversationChat({
  conversationId,
  onMessageSent
}: ConversationChatProps) {
  const { 
    getMessages, 
    addMessage, 
    loadMessages, 
    loading
  } = useAIMessageStore();
  
  const { userId } = useNotesDataStore();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<AIConversationMessage[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const storeMessages = getMessages(conversationId);
  const messages = useMemo(() => [...storeMessages, ...optimisticMessages], [storeMessages, optimisticMessages]);

  useEffect(() => {
    if (userId && conversationId) {
      loadMessages(userId, conversationId);
    }
  }, [userId, conversationId, loadMessages]);

  // Clear optimistic messages when conversation changes
  useEffect(() => {
    setOptimisticMessages([]);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !userId || isSending) return;

    const userMessage = message.trim();
    console.log("[ConversationChat] Sending message:", { userMessage, conversationId, isSending });
    
    // Clear input immediately for better UX
    setMessage("");
    setIsSending(true);

    // Create optimistic user message
    const tempUserMessage: AIConversationMessage = {
      id: `temp-${Date.now()}`,
      conversationId,
      content: userMessage,
      role: "user",
      timestamp: new Date(),
      metadata: {}
    };

    // Add optimistic message immediately
    setOptimisticMessages(prev => [...prev, tempUserMessage]);

    try {
      // Send real message to server
      const userMessageDoc = await addMessage(userId, conversationId, {
        content: userMessage,
        role: "user"
      });

      console.log("[ConversationChat] User message added:", userMessageDoc.id);
      onMessageSent?.(userMessageDoc);

      // Remove optimistic message since real message is now in store
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));

      // Simulate AI response (replace with actual AI integration)
      setTimeout(async () => {
        try {
          const aiResponse = await generateAIResponse(userMessage, messages);
          const aiMessageDoc = await addMessage(userId, conversationId, {
            content: aiResponse,
            role: "assistant"
          });

          console.log("[ConversationChat] AI message added:", aiMessageDoc.id);
          onMessageSent?.(aiMessageDoc);
        } catch (error) {
          console.error("Failed to generate AI response:", error);
        } finally {
          setIsSending(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Remove optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
      
      setIsSending(false);
    }
  };

  const generateAIResponse = async (userMessage: string, conversationHistory: AIConversationMessage[]): Promise<string> => {
    // This is a placeholder - replace with actual AI integration
    // You can integrate with your existing AI agent system here
    
    const responses = [
      "I understand your message. How can I help you further?",
      "That's an interesting point. Let me think about this...",
      "I see what you're getting at. Here's my perspective on this:",
      "Thank you for sharing that. Based on our conversation, I would suggest:",
      "I appreciate your input. Let me provide some insights on this topic:"
    ];

    // Simple response selection based on message length and history
    const responseIndex = (userMessage.length + conversationHistory.length) % responses.length;
    return responses[responseIndex];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <BotIcon className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start a conversation with AI</p>
              <p className="text-xs">Ask questions, get insights, or discuss ideas</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user" 
                    ? "bg-blue-500" 
                    : "bg-green-500"
                }`}>
                  {msg.role === "user" ? (
                    <User className="h-3 w-3 text-white" />
                  ) : (
                    <BotIcon className="h-3 w-3 text-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {msg.role === "user" ? "You" : "AI"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(msg.timestamp, "HH:mm")}
                    </span>
                  </div>
                  
                  <div className="text-xs leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isSending && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <BotIcon className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">AI</span>
                </div>
                <div className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="min-h-[32px] max-h-24 resize-none text-xs"
            disabled={isSending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            size="sm"
            className="px-2 h-8"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
