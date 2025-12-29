import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Button } from "@/common/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/common/lib/utils";

export interface ActionMenuProps {
  children: ReactNode;
  trigger?: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  width?: "sm" | "md" | "lg" | "xl";
  alwaysVisible?: boolean;
}

export function ActionMenu({
  children,
  trigger,
  triggerClassName,
  contentClassName,
  align = "end",
  sideOffset = 4,
  width = "md",
  alwaysVisible = false,
}: ActionMenuProps) {
  const widthClasses = {
    sm: "w-44",
    md: "w-52",
    lg: "w-60",
    xl: "w-72",
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 w-8 p-0 transition-all duration-200 rounded-md",
        "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
        "hover:bg-slate-200/60 dark:hover:bg-slate-700/60",
        "focus:outline-none",
        alwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        triggerClassName
      )}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More actions</span>
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger || defaultTrigger}</DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        className={cn(
          "p-1 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
          "min-w-[200px] max-w-[280px]",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-2px_rgba(0,0,0,0.1)]",
          widthClasses[width],
          contentClassName
        )}
        sideOffset={sideOffset}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
