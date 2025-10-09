import { Avatar, AvatarFallback } from "@/common/components/ui/avatar";
import { Card, CardContent } from "@/common/components/ui/card";
import { AIChatMessage } from "@/desktop/features/demo/features/space-aware-chat/types";
import React from "react";

interface ChatMessageProps {
  message: AIChatMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.isUser;

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
        </Avatar>
      )}

      <Card className={`max-w-[80%] ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        <CardContent className="p-3">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p
            className={`text-xs mt-2 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>

      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
