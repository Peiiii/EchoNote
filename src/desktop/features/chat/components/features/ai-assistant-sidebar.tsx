import { useChatStore } from "@/core/stores/chat-store";
import { Tool, ToolCall } from "@agent-labs/agent-chat";
import { Bot, X } from "lucide-react";
import { useMemo } from "react";

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
    const { channels, messages } = useChatStore();
    const currentChannel = channels.find(ch => ch.id === channelId);
    const channelMessages = messages.filter(msg => msg.channelId === channelId);



    // 定义频道特定的工具
    const tools = useMemo((): Tool[] => [
        // 工具1：分析频道内容
        {
            name: 'analyzeChannelContent',
            description: '分析当前频道的所有消息内容，提取关键信息',
            parameters: {
                type: 'object',
                properties: {
                    analysisType: {
                        type: 'string',
                        enum: ['summary', 'keywords', 'topics', 'sentiment', 'progress'],
                        description: '分析类型'
                    }
                },
                required: ['analysisType']
            },
            execute: async (toolCall: ToolCall) => {
                const args = JSON.parse(toolCall.function.arguments);
                const { analysisType } = args;

                // 分析频道内容
                const content = channelMessages.map(msg => msg.content).join('\n');

                let result = '';
                switch (analysisType) {
                    case 'summary':
                        result = `频道 "${currentChannel?.name}" 共有 ${channelMessages.length} 条消息。主要内容包括：${content.substring(0, 200)}...`;
                        break;
                    case 'keywords':
                        result = `从频道内容中提取的关键词：思考、记录、想法、笔记等`;
                        break;
                    case 'topics':
                        result = `频道主要讨论的话题：个人思考、工作记录、学习笔记等`;
                        break;
                    case 'sentiment':
                        result = `频道整体情感倾向：积极、中性，主要是记录和思考`;
                        break;
                    case 'progress':
                        result = `频道内容进展：持续记录中，内容不断积累`;
                        break;
                    default:
                        result = `频道内容分析完成，共 ${channelMessages.length} 条消息`;
                }

                return {
                    toolCallId: toolCall.id,
                    result,
                    state: 'result' as const
                };
            },
            render: () => (
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h3 className="font-medium mb-2">频道内容分析</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        正在分析频道内容...
                    </p>
                </div>
            )
        },

        // 工具2：创建频道标签
        {
            name: 'createChannelTag',
            description: '为频道创建标签，帮助组织和分类内容',
            parameters: {
                type: 'object',
                properties: {
                    tagName: { type: 'string', description: '标签名称' },
                    tagColor: { type: 'string', description: '标签颜色' }
                },
                required: ['tagName']
            },
            render: () => (
                <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium mb-2">创建频道标签</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        标签创建功能正在开发中...
                    </p>
                </div>
            )
        },

        // 工具3：频道内容总结
        {
            name: 'summarizeChannel',
            description: '总结频道的主要内容和发展趋势',
            parameters: {
                type: 'object',
                properties: {
                    timeRange: {
                        type: 'string',
                        enum: ['today', 'week', 'month', 'all'],
                        description: '时间范围'
                    }
                },
                required: ['timeRange']
            },
            execute: async (toolCall: ToolCall) => {
                const args = JSON.parse(toolCall.function.arguments);
                const { timeRange } = args;

                let filteredMessages = channelMessages;
                const now = new Date();

                // 根据时间范围过滤消息
                switch (timeRange) {
                    case 'today': {
                        filteredMessages = channelMessages.filter(msg => {
                            const msgDate = new Date(msg.timestamp);
                            return msgDate.toDateString() === now.toDateString();
                        });
                        break;
                    }
                    case 'week': {
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        filteredMessages = channelMessages.filter(msg =>
                            new Date(msg.timestamp) >= weekAgo
                        );
                        break;
                    }
                    case 'month': {
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        filteredMessages = channelMessages.filter(msg =>
                            new Date(msg.timestamp) >= monthAgo
                        );
                        break;
                    }
                }

                const summary = `频道 "${currentChannel?.name}" 在 ${timeRange} 时间范围内共有 ${filteredMessages.length} 条消息。主要内容包括思考记录、工作笔记、学习心得等。`;

                return {
                    toolCallId: toolCall.id,
                    result: summary,
                    state: 'result' as const
                };
            },
            render: () => (
                <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="font-medium mb-2">频道内容总结</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        正在总结频道内容...
                    </p>
                </div>
            )
        }
    ], [channelMessages, currentChannel]);

    

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

            {/* AI Assistant Content */}
            <div className="flex-1 overflow-hidden p-4">
                <div className="space-y-4">
                    <div className="text-center text-muted-foreground">
                        <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>AI助手正在开发中...</p>
                        <p className="text-sm">当前频道：{currentChannel?.name}</p>
                        <p className="text-sm">消息数量：{channelMessages.length}</p>
                    </div>
                    
                    <div className="space-y-2">
                        <h4 className="font-medium">可用工具：</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {tools.map((tool, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800">
                                    <h5 className="font-medium text-sm">{tool.name}</h5>
                                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    <p>AI助手已了解频道 "{currentChannel?.name}" 的所有内容</p>
                    <p>可以询问分析、总结、建议等问题</p>
                </div>
            </div>
        </div>
    );
};
