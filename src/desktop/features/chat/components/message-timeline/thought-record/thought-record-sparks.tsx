import { Button } from "@/common/components/ui/button";
import { Message, useChatDataStore } from "@/core/stores/chat-data-store";
import { generateSparksForText } from "@/desktop/features/chat/services/insights.service";
import { useState } from "react";

interface ThoughtRecordSparksProps {
    message: Message;
    showAnalysis: boolean;
    onToggleAnalysis: () => void;
}

export function ThoughtRecordSparks({
    message,
    showAnalysis,
    onToggleAnalysis,
}: ThoughtRecordSparksProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const updateMessage = useChatDataStore(state => state.updateMessage);

    const aiAnalysis = message.aiAnalysis;
    const hasSparks = !!(aiAnalysis && aiAnalysis.insights && aiAnalysis.insights.length > 0);

    async function handleGenerateSparks() {
        try {
            setIsGenerating(true);
            const sparks = await generateSparksForText(message.content);
            updateMessage(message.id, {
                aiAnalysis: {
                    ...aiAnalysis,
                    insights: sparks,
                    // keep optional fields if existed
                    keywords: aiAnalysis?.keywords ?? [],
                    topics: aiAnalysis?.topics ?? [],
                    sentiment: aiAnalysis?.sentiment ?? 'neutral',
                    summary: aiAnalysis?.summary ?? '',
                    tags: aiAnalysis?.tags ?? [],
                    relatedTopics: aiAnalysis?.relatedTopics ?? [],
                },
            });
            onToggleAnalysis();
        } finally {
            setIsGenerating(false);
        }
    }

    if (!showAnalysis) {
        return null;
    }

    return (
        <div className="mb-4 p-4 bg-slate-50/60 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="space-y-4">
                {/* Conditional: empty vs populated */}
                {!hasSparks ? (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 dark:text-slate-400">No sparks yet</span>
                        <Button onClick={handleGenerateSparks} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Sparks'}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Creative Sparks</span>
                            <Button onClick={handleGenerateSparks} variant="outline" disabled={isGenerating}>
                                {isGenerating ? 'Generating...' : 'Regenerate'}
                            </Button>
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
