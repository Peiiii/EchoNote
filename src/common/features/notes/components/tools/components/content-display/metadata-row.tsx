import { Badge } from '@/common/components/ui/badge';
import { cn } from '@/common/lib/utils';

export interface MetadataItem {
  label: string;
  value: string;
  variant?: 'default' | 'mono' | 'highlight';
}

export interface MetadataRowProps {
  items: MetadataItem[];
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

const gapStyles = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

const variantStyles = {
  default: 'text-gray-500 dark:text-gray-400',
  mono: 'font-mono text-gray-500 dark:text-gray-400',
  highlight: 'text-gray-700 dark:text-gray-300 font-medium',
};

export function MetadataRow({ 
  items, 
  className, 
  gap = 'md' 
}: MetadataRowProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn('flex items-center', gapStyles[gap], className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {item.variant === 'mono' ? (
            <Badge variant="outline" className="text-xs font-mono">
              {item.value}
            </Badge>
          ) : (
            <span className={cn('text-xs', variantStyles[item.variant || 'default'])}>
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
