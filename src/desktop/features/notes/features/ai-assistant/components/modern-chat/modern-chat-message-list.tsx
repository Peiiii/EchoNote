import { useEffect, useRef } from "react";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Bot, User, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ModernChatMessageListProps {
  messages: any[];
  isResponding: boolean;
  onPreviewHtml?: (html: string) => void;
}

export function ModernChatMessageList({
  messages,
  isResponding
}: ModernChatMessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isResponding]);

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user";
    const timestamp = message.timestamp ? new Date(message.timestamp) : new Date();

    return (
      <div key={message.id || index} className="flex gap-3 mb-4 last:mb-0">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? "bg-blue-500" 
            : "bg-gradient-to-br from-green-500 to-emerald-600"
        }`}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground">
              {isUser ? "You" : "AI Assistant"}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(timestamp, "HH:mm")}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {message.content && (
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}
            
            {/* Tool calls */}
            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.toolCalls.map((toolCall: any, toolIndex: number) => (
                  <div key={toolIndex} className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Using tool: {toolCall.toolName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {toolCall.args && JSON.stringify(toolCall.args, null, 2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tool results */}
            {message.toolResults && message.toolResults.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.toolResults.map((result: any, resultIndex: number) => (
                  <div key={resultIndex} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">
                      Tool result: {result.toolName}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      {result.result}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Welcome to AI Chat
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start a conversation with AI to get insights, ask questions, or discuss ideas. 
              I'm here to help you with any topic you'd like to explore.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => renderMessage(message, index))}
            
            {/* Loading indicator */}
            {isResponding && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
