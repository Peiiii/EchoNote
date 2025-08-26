import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Bot, Send } from "lucide-react";

interface MobileAIAssistantSidebarProps {
    onClose: () => void;
}

interface AIMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

export const MobileAIAssistantSidebar = ({
    onClose
}: MobileAIAssistantSidebarProps) => {
    const [messages, setMessages] = useState<AIMessage[]>([
        {
            id: '1',
            content: 'Hello! I\'m your AI assistant. How can I help you with your thoughts and ideas today?',
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: AIMessage = {
            id: Date.now().toString(),
            content: inputValue.trim(),
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Simulate AI response
        setTimeout(() => {
            const aiMessage: AIMessage = {
                id: (Date.now() + 1).toString(),
                content: `I understand you're asking about "${inputValue.trim()}". Let me help you explore this topic further. What specific aspect would you like to focus on?`,
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">AI Assistant</h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                >
                    <Bot className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                                message.isUser
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground'
                            }`}
                        >
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                            </div>
                            <div className={`text-xs mt-2 ${
                                message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        className="flex-1 px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground"
                    />
                    <Button
                        size="sm"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
