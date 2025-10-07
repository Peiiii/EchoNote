import { Lightbulb } from 'lucide-react';
import { Message, useNotesDataStore } from '@/core/stores/notes-data.store';
import { generateSparksForTextSimple } from '@/desktop/features/notes/features/ai-assistant/services/insights.service';
import { channelMessageService } from '@/core/services/channel-message.service';
import { useState, useEffect, useCallback } from 'react';
import { getFeaturesConfig } from '@/core/config/features.config';

interface MobileThoughtRecordSparksProps {
    message: Message;
    className?: string;
    showAnalysis: boolean;
    onToggleAnalysis: () => void;
    autoGenerate?: boolean;
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

    const handleGenerateSparks = useCallback(async () => {
        try {
            setIsGenerating(true);
            const sparks = await generateSparksForTextSimple(message.content);
            
            const { userId } = useNotesDataStore.getState();
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
    }, [message.content, message.id, message.channelId, aiAnalysis]);

    useEffect(() => {
        if (autoGenerate && showAnalysis && !hasSparks && !isGenerating) {
            handleGenerateSparks();
        }
    }, [autoGenerate, showAnalysis, hasSparks, isGenerating, handleGenerateSparks]);

    if (!getFeaturesConfig().channel.thoughtRecord.sparks.enabled) {
        return null;
    }

    if (!hasSparks && !showAnalysis) {
        return null;
    }

    return (
        <div className={className}>
            {hasSparks ? (
                <div className="space-y-2">
                    <button
                        onClick={onToggleAnalysis}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 group"
                        title={showAnalysis ? "Hide sparks" : "Show sparks"}
                    >
                        <Lightbulb className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            {aiAnalysis!.insights.length}
                        </span>
                    </button>
                    
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
