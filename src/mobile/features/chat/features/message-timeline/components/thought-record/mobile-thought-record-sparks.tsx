import { Lightbulb } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Message, useChatDataStore } from '@/core/stores/chat-data.store';
import { generateSparksForTextSimple } from '@/desktop/features/chat/features/ai-assistant/services/insights.service';
import { channelMessageService } from '@/core/services/channel-message.service';
import { useState, useEffect } from 'react';

interface MobileThoughtRecordSparksProps {
    message: Message;
    className?: string;
    showAnalysis: boolean;
    onToggleAnalysis: () => void;
    autoGenerate?: boolean; // 是否自动生成 sparks
}

export function MobileThoughtRecordSparks({ 
    message, 
    showAnalysis, 
    onToggleAnalysis,
    className,
    autoGenerate = false
}: MobileThoughtRecordSparksProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    
    const aiAnalysis = message.aiAnalysis;
    const hasSparks = Boolean(aiAnalysis?.insights?.length);

    // 自动生成 sparks 的逻辑
    useEffect(() => {
        if (autoGenerate && showAnalysis && !hasSparks && !isGenerating) {
            handleGenerateSparks();
        }
    }, [autoGenerate, showAnalysis, hasSparks, isGenerating]);

    async function handleGenerateSparks() {
        try {
            setIsGenerating(true);
            const sparks = await generateSparksForTextSimple(message.content);
            
            const { userId } = useChatDataStore.getState();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            await channelMessageService.updateMessage({
                messageId: message.id,
                channelId: message.channelId,
                updates: {
                    aiAnalysis: {
                        ...aiAnalysis,
                        insights: sparks,
                        keywords: aiAnalysis?.keywords ?? [],
                        topics: aiAnalysis?.topics ?? [],
                        sentiment: aiAnalysis?.sentiment ?? 'neutral',
                        summary: aiAnalysis?.summary ?? '',
                        tags: aiAnalysis?.tags ?? [],
                        relatedTopics: aiAnalysis?.relatedTopics ?? [],
                    },
                },
                userId
            });
        } catch (error) {
            console.error('Failed to generate sparks:', error);
        } finally {
            setIsGenerating(false);
        }
    }

    // 如果有 sparks，总是显示组件（用于底部图标）
    // 如果没有 sparks 但 showAnalysis 为 true，显示生成状态
    if (!hasSparks && !showAnalysis) {
        return null;
    }

    return (
        <div className={className}>
            {/* 如果有 sparks，显示展开/收起按钮 */}
            {hasSparks ? (
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggleAnalysis}
                        className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {showAnalysis ? 'Hide' : `${aiAnalysis!.insights.length} Sparks`}
                    </Button>
                    
                    {/* Sparks Content - 只在展开时显示 */}
                    {showAnalysis && (
                        <div className="space-y-2">
                            {aiAnalysis!.insights.map((insight: string, index: number) => (
                                <div
                                    key={index}
                                    className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                                >
                                    {insight}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* 如果没有 sparks，显示生成状态 */
                <div className="flex items-center justify-center py-4">
                    {isGenerating ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Generating sparks...
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                            No sparks available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
