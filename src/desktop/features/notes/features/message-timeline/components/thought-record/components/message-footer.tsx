import { FooterItem } from "./footer-item";
import { ThreadIndicator } from "./thread-indicator";
import { MessageFooterProps } from "../types";
import { getFeaturesConfig } from "@/core/config/features.config";

export function MessageFooter({
  message,
  hasSparks,
  aiAnalysis,
  onToggleAnalysis,
  threadCount,
}: Omit<MessageFooterProps, "onOpenThread">) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-6">
      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        {hasSparks && getFeaturesConfig().channel.thoughtRecord.sparks.enabled && (
          <FooterItem onClick={onToggleAnalysis}>{aiAnalysis!.insights.length} sparks</FooterItem>
        )}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        {getFeaturesConfig().channel.thoughtRecord.thread.enabled && (
          <ThreadIndicator threadCount={threadCount} messageId={message.id} />
        )}
      </div>
    </div>
  );
}
