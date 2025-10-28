import { ContentCard } from "../display/content-card";
import { cn } from "@/common/lib/utils";

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
  return (
    <div className={cn("space-y-3", className)}>
      {showLabels && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {original.label || "Original"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">→</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {updated.label || "Updated"}
          </span>
        </div>
      )}
      <div className="space-y-3">
        <ContentCard
          content={original.content}
          variant="default"
          className="max-h-48"
          showScrollbar={true}
          placeholder={original.placeholder || "Loading original content..."}
        />
        <ContentCard
          content={updated.content}
          variant="success"
          className="max-h-48"
          showScrollbar={true}
          placeholder={updated.placeholder || "Loading updated content..."}
        />
      </div>
    </div>
  );
}
