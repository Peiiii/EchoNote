import { ReactNode } from "react";
import { DropdownMenuItem } from "@/common/components/ui/dropdown-menu";
import { cn } from "@/common/lib/utils";

export interface ActionMenuItemProps {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "warning";
  className?: string;
}

export function ActionMenuItem({
  icon,
  title,
  description,
  onClick,
  variant = "default",
  className
}: ActionMenuItemProps) {
  const variantStyles = {
    default: "text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/60",
    destructive: "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50/80 dark:hover:bg-red-900/20",
    warning: "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50/80 dark:hover:bg-amber-800/20"
  };

  const iconBgVariants = {
    default: "bg-slate-50 dark:bg-slate-800/60",
    destructive: "bg-red-50 dark:bg-red-900/20",
    warning: "bg-amber-50 dark:bg-amber-900/20"
  };

  const iconColorVariants = {
    default: "text-slate-600 dark:text-slate-400",
    destructive: "text-red-600 dark:text-red-400",
    warning: "text-amber-600 dark:text-amber-400"
  };

  return (
    <DropdownMenuItem
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group",
        variantStyles[variant],
        className
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200",
        iconBgVariants[variant],
        "group-hover:bg-opacity-80"
      )}>
        <div className={cn("w-4 h-4", iconColorVariants[variant])}>
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{title}</div>
        {description && (
          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{description}</div>
        )}
      </div>
    </DropdownMenuItem>
  );
}
