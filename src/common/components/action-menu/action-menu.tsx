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
}

export function ActionMenu({
  children,
  trigger,
  triggerClassName,
  contentClassName,
  align = "end",
  sideOffset = 8,
  width = "lg"
}: ActionMenuProps) {
  const widthClasses = {
    sm: "w-40",
    md: "w-48", 
    lg: "w-56",
    xl: "w-64"
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/60 hover:scale-105 hover:shadow-sm border border-transparent hover:border-slate-200/60 dark:hover:border-slate-600/40",
        triggerClassName
      )}
    >
      <MoreHorizontal className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      <span className="sr-only">More actions</span>
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align={align}
        className={cn(
          "p-2 rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl",
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
