import { LucideIcon } from "lucide-react";
import { cn } from "@/common/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  className?: string;
}

export function EmptyState({ icon: Icon, message, className }: EmptyStateProps) {
  return (
    <div className={cn("flex items-center gap-2 text-gray-500 dark:text-gray-400", className)}>
      <Icon className="w-4 h-4" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
