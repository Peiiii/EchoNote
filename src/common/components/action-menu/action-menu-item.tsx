import { ReactNode } from "react";
import { DropdownMenuItem } from "@/common/components/ui/dropdown-menu";
import { cn } from "@/common/lib/utils";

export interface ActionMenuItemProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "warning";
  disabled?: boolean;
  className?: string;
}

export function ActionMenuItem({
  icon,
  title,
  description,
  onClick,
  variant = "default",
  disabled = false,
  className
}: ActionMenuItemProps) {
  const variantStyles = {
    default: "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
    destructive: "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
    warning: "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
  };

  const iconVariants = {
    default: "text-slate-500 dark:text-slate-400",
    destructive: "text-red-500 dark:text-red-400",
    warning: "text-amber-500 dark:text-amber-400"
  };

  return (
    <DropdownMenuItem
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-150 group",
        "rounded-md text-sm font-medium",
        variantStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className={cn(
        "w-4 h-4 flex-shrink-0 transition-colors duration-150",
        iconVariants[variant],
        "group-hover:scale-105"
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate">{title}</div>
        {description && (
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {description}
          </div>
        )}
      </div>
    </DropdownMenuItem>
  );
}
