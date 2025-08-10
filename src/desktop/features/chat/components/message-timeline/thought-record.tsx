import { format } from "date-fns";
import { MoreHorizontal, Clock, Eye, Bookmark, MessageCircle, Lightbulb } from "lucide-react";
import { Message, useChatStore } from "@/core/stores/chat-store";
import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { generateInsightsForText } from "@/desktop/features/chat/services/insights.service";

interface ThoughtRecordProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
    onOpenThread?: (messageId: string) => void;
    threadCount?: number;
}

export const ThoughtRecord = ({ message, onReply, onOpenThread, threadCount = 0 }: ThoughtRecordProps) => {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const updateMessage = useChatStore(state => state.updateMessage);

    const aiAnalysis = message.aiAnalysis;
    const hasInsights = !!(aiAnalysis && aiAnalysis.insights && aiAnalysis.insights.length > 0);

    async function handleGenerateInsights() {
        try {
            setIsGenerating(true);
            const insights = await generateInsightsForText(message.content, 'zh');
            updateMessage(message.id, {
                aiAnalysis: {
                    ...aiAnalysis,
                    insights,
                    // keep optional fields if existed
                    keywords: aiAnalysis?.keywords ?? [],
                    topics: aiAnalysis?.topics ?? [],
                    sentiment: aiAnalysis?.sentiment ?? 'neutral',
                    summary: aiAnalysis?.summary ?? '',
                    tags: aiAnalysis?.tags ?? [],
                    relatedTopics: aiAnalysis?.relatedTopics ?? [],
                },
            });
            setShowAnalysis(true);
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="w-full">
            {/* Thought Record Container */}
            <div className="group relative w-full px-8 py-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 ease-out hover:shadow-sm">
                {/* Record Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-sm"></div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{format(message.timestamp, 'HH:mm')}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <button
                            onClick={() => setShowAnalysis(!showAnalysis)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                            title="Toggle insights"
                        >
                            <Lightbulb className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                            title="View details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                            title="Bookmark"
                        >
                            <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onReply}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                            title="Add thought"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mb-4">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal">
                            {message.content}
                        </p>
                    </div>
                </div>

                {/* Insights Section */}
                {showAnalysis && (
                    <div className="mb-4 p-4 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="space-y-4">
                            {/* Conditional: empty vs populated */}
                            {!hasInsights ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">暂无洞察</span>
                                    <Button onClick={handleGenerateInsights} disabled={isGenerating}>
                                        {isGenerating ? '生成中…' : '一键生成洞察'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Insights</span>
                                        <Button onClick={handleGenerateInsights} variant="outline" disabled={isGenerating}>
                                            {isGenerating ? '生成中…' : '重新生成'}
                                        </Button>
                                    </div>
                                    <ul className="space-y-2">
                                        {aiAnalysis!.insights.slice(0,3).map((insight, idx) => (
                                            <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                                                <span>{insight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                            {message.content.length} characters
                        </span>
                        {hasInsights && (
                            <>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                                    {aiAnalysis!.insights.length} insights
                                </span>
                            </>
                        )}
                    </div>

                    {/* Thread indicator */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        {threadCount > 0 ? (
                            <button
                                onClick={() => onOpenThread?.(message.id)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                <MessageCircle className="w-3 h-3" />
                                <span>{threadCount} replies</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => onOpenThread?.(message.id)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                <MessageCircle className="w-3 h-3" />
                                <span>Start discussion</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
