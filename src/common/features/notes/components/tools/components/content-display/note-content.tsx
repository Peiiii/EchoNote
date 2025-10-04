import { ContentCard } from './content-card';
import { MetadataRow, MetadataItem } from './metadata-row';

export interface NoteContentProps {
  content: string;
  showMetadata?: boolean;
  metadata?: {
    noteId?: string;
    timestamp?: string;
    contentLength?: number;
  };
  variant?: 'preview' | 'detail' | 'comparison' | 'error';
  maxHeight?: string;
  className?: string;
  placeholder?: string;
}

export function NoteContent({
  content,
  showMetadata = false,
  metadata,
  variant = 'preview',
  maxHeight,
  className,
  placeholder,
}: NoteContentProps) {
  const metadataItems: MetadataItem[] = [];
  
  if (showMetadata && metadata) {
    if (metadata.noteId) {
      metadataItems.push({
        label: 'ID',
        value: metadata.noteId,
        variant: 'mono',
      });
    }
    if (metadata.timestamp) {
      metadataItems.push({
        label: 'Time',
        value: metadata.timestamp,
        variant: 'default',
      });
    }
    if (metadata.contentLength) {
      metadataItems.push({
        label: 'Length',
        value: `${metadata.contentLength} chars`,
        variant: 'default',
      });
    }
  }

  const cardVariant = variant === 'detail' ? 'success' : variant === 'error' ? 'error' : 'default';
  const cardMaxHeight = variant === 'comparison' ? 'max-h-48' : maxHeight;

  return (
    <div className={className}>
      {showMetadata && metadataItems.length > 0 && (
        <MetadataRow items={metadataItems} className="mb-3" />
      )}
      <ContentCard
        content={content}
        variant={cardVariant}
        maxHeight={cardMaxHeight}
        showScrollbar={variant === 'comparison'}
        placeholder={placeholder}
      />
    </div>
  );
}
