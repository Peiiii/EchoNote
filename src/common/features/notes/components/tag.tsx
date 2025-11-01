import { cn } from "@/common/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/common/components/ui/button";

export interface TagProps {
  name: string;
  variant?: "default" | "secondary" | "outline" | "destructive" | "footer";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  truncate?: boolean;
  maxWidth?: string;
}

const tagVariants = {
  default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  footer: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
};

const tagSizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1.5 text-sm",
  lg: "px-3 py-2 text-base",
};

export function Tag({
  name,
  variant = "default",
  size = "sm",
  removable = false,
  onClick,
  onRemove,
  className,
  truncate = false,
  maxWidth = "80px",
}: TagProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
        tagVariants[variant],
        tagSizes[size],
        onClick && "cursor-pointer hover:opacity-80",
        truncate && "max-w-[80px]",
        className
      )}
      style={truncate ? { maxWidth } : undefined}
      onClick={onClick}
      title={truncate ? name : undefined}
    >
      <span className={cn(truncate && "truncate")}>#{name}</span>
      {removable && (
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={handleRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </span>
  );
}

export interface TagListProps {
  tags: string[];
  variant?: TagProps["variant"];
  size?: TagProps["size"];
  removable?: boolean;
  onTagClick?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  className?: string;
  maxTags?: number;
  truncate?: boolean;
  maxWidth?: string;
}

export function TagList({
  tags,
  variant = "default",
  size = "sm",
  removable = false,
  onTagClick,
  onTagRemove,
  className,
  maxTags,
  truncate = false,
  maxWidth = "80px",
}: TagListProps) {
  const displayTags = maxTags ? tags.slice(0, maxTags) : tags;
  const remainingCount = maxTags && tags.length > maxTags ? tags.length - maxTags : 0;

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {displayTags.map(tag => (
        <Tag
          key={tag}
          name={tag}
          variant={variant}
          size={size}
          removable={removable}
          onClick={() => onTagClick?.(tag)}
          onRemove={() => onTagRemove?.(tag)}
          truncate={truncate}
          maxWidth={maxWidth}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">+{remainingCount} more</span>
      )}
    </div>
  );
}
