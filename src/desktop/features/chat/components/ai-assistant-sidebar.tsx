import { X, Bot } from "lucide-react";
import { useMemo } from "react";
import { useChatStore } from "@/core/stores/chat-store";
import { AgentChatCore } from "@agent-labs/agent-chat";
import { aiAgentFactory } from "../services/ai-agent-factory";

interface AIAssistantSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
}

export const AIAssistantSidebar = ({ 
    isOpen, 
    onClose, 
    channelId 
}: AIAssistantSidebarProps) => {
    const { channels } = useChatStore();
    const currentChannel = channels.find(ch => ch.id === channelId);
    
    // 创建HttpAgent实例
    const agent = useMemo(() => aiAgentFactory.createAgent(), []);
    
    // 获取频道相关工具
    const tools = useMemo(() => aiAgentFactory.getChannelTools(channelId), [channelId]);
    
    // 获取频道上下文
    const contexts = useMemo(() => [aiAgentFactory.getChannelContext(channelId)], [channelId]);

    if (!isOpen) return null;

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        AI Assistant
                    </h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                        {currentChannel?.name}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* AI Chat Interface */}
            <div className="flex-1 overflow-hidden">
                <AgentChatCore
                    agent={agent}
                    tools={tools}
                    contexts={contexts}
                    className="h-full"
                />
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    <p>AI Assistant understands channel "{currentChannel?.name}"</p>
                    <p>Ask questions or use available tools</p>
                </div>
            </div>
        </div>
    );
};
