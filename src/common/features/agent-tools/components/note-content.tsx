import { ContentCard } from "@/common/lib/agent-tools-ui";
import { MetadataRow, MetadataItem } from "@/common/lib/agent-tools-ui";

export interface NoteContentProps {
  content: string;
  showMetadata?: boolean;
  metadata?: {
    noteId?: string;
    timestamp?: string;
    contentLength?: number;
  };
  variant?: "preview" | "detail" | "comparison" | "error";
  maxHeight?: string;
  className?: string;
  placeholder?: string;
}

export function NoteContent({
  content,
  showMetadata = false,
  metadata,
  variant = "preview",
  maxHeight,
  className,
  placeholder,
}: NoteContentProps) {
  const metadataItems: MetadataItem[] = [];

  if (showMetadata && metadata) {
    if (metadata.noteId) {
      metadataItems.push({
        label: "ID",
        value: metadata.noteId,
        variant: "mono",
      });
    }
    if (metadata.timestamp) {
      metadataItems.push({
        label: "Time",
        value: metadata.timestamp,
        variant: "default",
      });
    }
    if (metadata.contentLength) {
      metadataItems.push({
        label: "Length",
        value: `${metadata.contentLength} chars`,
        variant: "default",
      });
    }
  }

  const cardVariant = variant === "detail" ? "success" : variant === "error" ? "error" : "default";
  const useComparisonClamp = variant === "comparison";

  return (
    <div className={className}>
      {showMetadata && metadataItems.length > 0 && (
        <MetadataRow items={metadataItems} className="mb-3" />
      )}
      <ContentCard
        content={content}
        variant={cardVariant}
        className={useComparisonClamp ? "max-h-48" : undefined}
        maxHeight={useComparisonClamp ? undefined : maxHeight}
        showScrollbar={variant === "comparison"}
        placeholder={placeholder}
      />
    </div>
  );
}
