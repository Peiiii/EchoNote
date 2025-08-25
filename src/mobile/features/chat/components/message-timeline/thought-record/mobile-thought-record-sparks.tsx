import { Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Message } from '@/core/stores/chat-data.store';

interface MobileThoughtRecordSparksProps {
    message: Message;
    showAnalysis: boolean;
    onToggleAnalysis: () => void;
}

export function MobileThoughtRecordSparks({ 
    message, 
    showAnalysis, 
    onToggleAnalysis 
}: MobileThoughtRecordSparksProps) {
    const aiAnalysis = message.aiAnalysis;
    const hasSparks = Boolean(aiAnalysis?.insights?.length);

    if (!hasSparks) {
        return null;
    }

    return (
        <div className="mt-4">
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggleAnalysis}
                className="h-8 px-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 mb-3"
            >
                <Lightbulb className="w-3 h-3 mr-1" />
                {showAnalysis ? 'Hide Sparks' : `Show ${aiAnalysis!.insights.length} Sparks`}
            </Button>

            {/* Sparks Content */}
            {showAnalysis && (
                <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                        <Sparkles className="w-3 h-3" />
                        AI Insights
                    </div>
                    <div className="space-y-2">
                        {aiAnalysis!.insights.map((insight: string, index: number) => (
                            <div
                                key={index}
                                className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed p-2 bg-white/50 dark:bg-slate-800/50 rounded border border-blue-200/30 dark:border-blue-600/30"
                            >
                                {insight}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
