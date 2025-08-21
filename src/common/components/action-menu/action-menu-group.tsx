import { ReactNode } from "react";
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from "@/common/components/ui/dropdown-menu";
import { cn } from "@/common/lib/utils";

export interface ActionMenuGroupProps {
  title?: string;
  children: ReactNode;
  variant?: "default" | "warning" | "danger";
  showSeparator?: boolean;
  className?: string;
}

export function ActionMenuGroup({
  title,
  children,
  variant = "default",
  showSeparator = true,
  className
}: ActionMenuGroupProps) {
  const variantStyles = {
    default: "text-slate-500 dark:text-slate-400",
    warning: "text-amber-500 dark:text-amber-400",
    danger: "text-red-500 dark:text-red-400"
  };

  return (
    <>
      {showSeparator && (
        <DropdownMenuSeparator className="my-2 bg-slate-200/60 dark:bg-slate-700/40" />
      )}
      
      <DropdownMenuGroup className={cn("space-y-1", className)}>
        {title && (
          <DropdownMenuLabel className={cn(
            "px-3 py-2 text-xs font-semibold uppercase tracking-wider",
            variantStyles[variant]
          )}>
            {title}
          </DropdownMenuLabel>
        )}
        {children}
      </DropdownMenuGroup>
    </>
  );
}
