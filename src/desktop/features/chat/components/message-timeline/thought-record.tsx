import { format } from "date-fns";
import { MoreHorizontal, Clock, Eye, Bookmark, MessageCircle, Hash, Lightbulb, TrendingUp, Tag } from "lucide-react";
import { Message } from "@/core/stores/chat-store";
import { useState } from "react";

interface ThoughtRecordProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
    onOpenThread?: (messageId: string) => void;
    threadCount?: number;
}

export const ThoughtRecord = ({ message, onReply, onOpenThread, threadCount = 0 }: ThoughtRecordProps) => {
    const [showAnalysis, setShowAnalysis] = useState(false);
    
    // Mock AI analysis data - in real app this would come from message.aiAnalysis
    const aiAnalysis = message.aiAnalysis || {
        keywords: ["设计思维", "用户体验", "产品创新"],
        topics: ["产品设计", "用户研究", "创新方法"],
        sentiment: "positive" as const,
        summary: "这是一个关于产品设计和用户体验的深度思考，体现了对用户需求的关注和创新思维。",
        tags: ["产品", "设计", "创新"],
        insights: ["建议进一步探索用户反馈机制", "可以考虑A/B测试验证想法"],
        relatedTopics: ["设计系统", "用户旅程", "原型设计"]
    };

    const hasAnalysis = message.aiAnalysis || true; // For demo purposes

    return (
        <div className="w-full">
            {/* Thought Record Container - Enhanced with subtle interactions */}
            <div className="group relative w-full px-8 py-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 ease-out hover:scale-[1.001] hover:shadow-sm">
                
                {/* Record Header - Enhanced with better visual hierarchy */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-sm"></div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{format(message.timestamp, 'HH:mm')}</span>
                        </div>
                        {/* Show meaningful AI tags instead of generic "AI Analyzed" */}
                        {hasAnalysis && aiAnalysis.tags.length > 0 && (
                            <div className="flex items-center gap-1">
                                {aiAnalysis.tags.slice(0, 2).map((tag, index) => (
                                    <span key={index} className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                                        {tag}
                                    </span>
                                ))}
                                {aiAnalysis.tags.length > 2 && (
                                    <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                                        +{aiAnalysis.tags.length - 2}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Enhanced Action Menu - Progressive disclosure */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        {hasAnalysis && (
                            <button
                                onClick={() => setShowAnalysis(!showAnalysis)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                                title="Toggle AI analysis"
                            >
                                <Lightbulb className="w-4 h-4" />
                            </button>
                        )}
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

                {/* Main Thought Content - Enhanced typography */}
                <div className="mb-4">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal selection:bg-blue-100 dark:selection:bg-blue-900/30">
                            {message.content}
                        </p>
                    </div>
                </div>

                {/* AI Analysis Section - Collapsible */}
                {hasAnalysis && showAnalysis && (
                    <div className="mb-4 p-4 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="space-y-4">
                            {/* Summary */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Summary</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {aiAnalysis.summary}
                                </p>
                            </div>

                            {/* Keywords and Topics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Hash className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Keywords</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {aiAnalysis.keywords.map((keyword, index) => (
                                            <span key={index} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Topics</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {aiAnalysis.topics.map((topic, index) => (
                                            <span key={index} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Insights */}
                            {aiAnalysis.insights.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Insights</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {aiAnalysis.insights.map((insight, index) => (
                                            <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                                <span className="w-1 h-1 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                                                <span>{insight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Enhanced Footer - More interactive and informative */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                            {message.content.length} characters
                        </span>
                        {hasAnalysis && (
                            <>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                                    {aiAnalysis.keywords.length} keywords
                                </span>
                            </>
                        )}
                    </div>
                    
                    {/* Enhanced Thread indicator with click to open */}
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
