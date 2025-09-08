import { Button } from "@/common/components/ui/button";
import { Message, useChatDataStore } from "@/core/stores/chat-data.store";
import { generateSparksForText, GenerateSparksOptions } from "@/desktop/features/chat/features/ai-assistant/services/insights.service";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useState } from "react";
import { cn } from "@/common/lib/utils";
import { X } from "lucide-react";

interface ThoughtRecordSparksProps {
    message: Message;
    showAnalysis: boolean;
    className?: string;
    onClose?: () => void;
    enableContextEnhancement?: boolean;
}

export function ThoughtRecordSparks({
    message,
    showAnalysis,
    className,
    onClose,
    enableContextEnhancement = true,
}: ThoughtRecordSparksProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const aiAnalysis = message.aiAnalysis;
    const hasSparks = !!(aiAnalysis && aiAnalysis.insights && aiAnalysis.insights.length > 0);

    async function handleGenerateSparks() {
        try {
            setIsGenerating(true);
            
            // Prepare options for context enhancement
            const options: GenerateSparksOptions = {
                includeChannelContext: enableContextEnhancement,
                contextOptions: {
                    maxMessages: 8,
                    maxContentLength: 1500,
                }
            };
            
            const sparks = await generateSparksForText(
                message.content,
                message.channelId,
                message.id,
                options
            );
            
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
            
            // Remove this line to keep the panel open after generating sparks
            // onToggleAnalysis();
        } finally {
            setIsGenerating(false);
        }
    }

    if (!showAnalysis) {
        return null;
    }

    return (
        <div className={cn("mb-4 p-4 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50", className)}>
            <div className="space-y-4">
                {/* Conditional: empty vs populated */}
                {!hasSparks ? (
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Creative Sparks</span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handleGenerateSparks} disabled={isGenerating}>
                                {isGenerating ? 'Generating...' : 'Generate Sparks'}
                            </Button>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                                    title="Close analysis"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Creative Sparks</span>
                            <div className="flex items-center gap-2">
                                <Button onClick={handleGenerateSparks} variant="outline" disabled={isGenerating}>
                                    {isGenerating ? 'Generating...' : 'Regenerate'}
                                </Button>
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                                        title="Close analysis"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            {aiAnalysis?.insights?.map((spark, index) => (
                                <div key={index} className="p-3 bg-white/60 dark:bg-slate-700/40 rounded-lg border border-slate-200/40 dark:border-slate-600/40">
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/80 mt-2 flex-shrink-0"></div>
                                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                                            {spark}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
