import { ContentCard } from "../display/content-card";
import { cn } from "@/common/lib/utils";
import { useTranslation } from "react-i18next";

export interface ComparisonItem {
  content: string;
  label?: string;
  placeholder?: string;
}

export interface ComparisonLayoutProps {
  original: ComparisonItem;
  updated: ComparisonItem;
  showLabels?: boolean;
  className?: string;
}

export function ComparisonLayout({
  original,
  updated,
  showLabels = true,
  className,
}: ComparisonLayoutProps) {
  const { t } = useTranslation();
  return (
    <div className={cn("space-y-3", className)}>
      {showLabels && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {original.label || t('agentTools.comparisonLayout.original')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {updated.label || t('agentTools.comparisonLayout.updated')}
          </span>
        </div>
      )}
      <div className="space-y-3">
        <ContentCard
          content={original.content}
          variant="default"
          className="max-h-48"
          showScrollbar={true}
          placeholder={original.placeholder || t('agentTools.comparisonLayout.loadingOriginal')}
        />
        <ContentCard
          content={updated.content}
          variant="success"
          className="max-h-48"
          showScrollbar={true}
          placeholder={updated.placeholder || t('agentTools.comparisonLayout.loadingUpdated')}
        />
      </div>
    </div>
  );
}
