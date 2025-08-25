import { Lightbulb } from 'lucide-react';
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
        <div className="mt-3">
            {/* Toggle Button - Simplified */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggleAnalysis}
                className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
                <Lightbulb className="w-3 h-3 mr-1" />
                {showAnalysis ? 'Hide' : `${aiAnalysis!.insights.length} Sparks`}
            </Button>

            {/* Sparks Content - Simplified */}
            {showAnalysis && (
                <div className="mt-2 space-y-2">
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
    );
}
