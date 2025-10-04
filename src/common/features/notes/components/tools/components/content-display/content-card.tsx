import { cn } from '@/common/lib/utils';

export interface ContentCardProps {
  content: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  maxHeight?: string;
  showScrollbar?: boolean;
  className?: string;
  placeholder?: string;
}

const variantStyles = {
  default: 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800',
  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900',
  warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-900',
  error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900',
};

const textStyles = {
  default: 'text-gray-700 dark:text-gray-300',
  success: 'text-gray-700 dark:text-gray-200',
  warning: 'text-gray-700 dark:text-gray-200',
  error: 'text-gray-600 dark:text-gray-300',
};

export function ContentCard({
  content,
  variant = 'default',
  maxHeight,
  showScrollbar = true,
  className,
  placeholder = 'Loading content...',
}: ContentCardProps) {
  const displayContent = content || placeholder;
  
  return (
    <div
      className={cn(
        'rounded-md border p-3',
        variantStyles[variant],
        showScrollbar && 'overflow-y-auto',
        className
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <p className={cn('text-sm whitespace-pre-wrap', textStyles[variant])}>
        {displayContent}
      </p>
    </div>
  );
}
