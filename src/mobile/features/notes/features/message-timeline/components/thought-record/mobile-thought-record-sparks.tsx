import { Lightbulb, X } from "lucide-react";
import { Message } from "@/core/stores/notes-data.store";
import { useEffect } from "react";
import { getFeaturesConfig } from "@/core/config/features.config";
import { Button } from "@/common/components/ui/button";
import { useSparks } from "@/common/features/notes/hooks/use-sparks";
import { useTranslation } from "react-i18next";

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
  autoGenerate = false,
}: MobileThoughtRecordSparksProps) {
  const aiAnalysis = message.aiAnalysis;
  const {
    isGenerating,
    error,
    hasTagContext,
    contentTooShort,
    sparks,
    generate,
    regenerate,
  } = useSparks(message, { enableContextEnhancement: true, mode: "stream" });
  const hasSparks = Boolean((sparks && sparks.length) || aiAnalysis?.insights?.length);
  const renderSparks = sparks ?? aiAnalysis?.insights ?? [];

  useEffect(() => {
    if (autoGenerate && showAnalysis && !hasSparks && !isGenerating) {
      generate();
    }
  }, [autoGenerate, showAnalysis, hasSparks, isGenerating, generate]);

  if (!getFeaturesConfig().channel.thoughtRecord.sparks.enabled) {
    return null;
  }

  if (!hasSparks && !showAnalysis) {
    return null;
  }

  return (
    <div className={className}>
      <div className="space-y-2">
        {/* Toggle chip */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAnalysis}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200 group"
            title={showAnalysis ? "Hide sparks" : "Show sparks"}
          >
            <Lightbulb className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              {hasSparks ? aiAnalysis!.insights.length : 0}
            </span>
          </button>
          {hasTagContext && (
            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
              {t("notes.messageTimeline.tagEnhanced")}
            </span>
          )}
        </div>

        {/* Panel */}
        {showAnalysis && (
          <div className="space-y-2">
            {!hasSparks ? (
              <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-800/30">
                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Generating sparks...
                    </div>
                  ) : error ? (
                    <div className="text-xs text-red-500">Failed: {error}</div>
                  ) : contentTooShort ? (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Add a bit more content to get meaningful sparks
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400">No sparks yet</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generate}
                    disabled={isGenerating || contentTooShort}
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                  <button
                    onClick={onToggleAnalysis}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                    title="Close analysis"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {renderSparks.map((insight: string, index: number) => (
                  <div
                    key={index}
                    className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed p-2 bg-white/60 dark:bg-slate-700/40 rounded-lg border border-slate-200/40 dark:border-slate-600/40"
                  >
                    {insight}
                  </div>
                ))}
                <div className="flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={regenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Regenerate"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
