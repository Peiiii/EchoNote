import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { Avatar } from "@/common/components/ui/avatar";
import { Badge } from "@/common/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export const MessageList = () => {
    const messages = useCurrentChannelMessages();

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <p className="text-lg font-medium">开始你的对话</p>
                    <p className="text-sm">在下方输入框中发送消息</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex gap-3 ${
                        message.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                >
                    <Avatar className="w-8 h-8">
                        <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                            {message.sender === "user" ? "我" : "AI"}
                        </div>
                    </Avatar>
                    
                    <div className={`flex-1 max-w-[70%] ${
                        message.sender === "user" ? "text-right" : ""
                    }`}>
                        <div className={`inline-block p-3 rounded-lg ${
                            message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                        }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>
                                {formatDistanceToNow(message.timestamp, {
                                    addSuffix: true,
                                    locale: zhCN,
                                })}
                            </span>
                            
                            {message.tags && message.tags.length > 0 && (
                                <div className="flex gap-1">
                                    {message.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}; 