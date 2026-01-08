import { cn } from "@/common/lib/utils";
import type { KeyboardEventHandler, ReactNode } from "react";

interface ExpandedSurfaceProps {
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  onKeyDownCapture?: KeyboardEventHandler<HTMLDivElement>;
  className?: string;
}

export function ExpandedSurface({
  headerLeft,
  headerRight,
  banner,
  children,
  onKeyDown,
  onKeyDownCapture,
  className,
}: ExpandedSurfaceProps) {
  return (
    <div
      className={cn("w-full h-full min-h-0 flex flex-col bg-background", className)}
      data-component="expanded-surface"
      onKeyDown={onKeyDown}
      onKeyDownCapture={onKeyDownCapture}
    >
      {(headerLeft || headerRight) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30">
          <div className="flex items-center gap-1.5 min-w-0">{headerLeft}</div>
          <div className="flex items-center gap-1.5">{headerRight}</div>
        </div>
      )}

      <div className="flex-1 min-h-0 p-3 overflow-hidden flex flex-col gap-3">
        {banner}
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}
