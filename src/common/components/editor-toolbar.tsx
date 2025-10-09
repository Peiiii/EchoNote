import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/lib/utils";
import { ReactNode } from "react";

interface EditorToolbarAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "ghost" | "outline" | "destructive";
  size?: "sm" | "default" | "lg";
  icon?: ReactNode;
  className?: string;
}

interface EditorToolbarProps {
  actions?: EditorToolbarAction[];
  className?: string;
  leftActions?: EditorToolbarAction[];
  rightActions?: EditorToolbarAction[];
}

export const EditorToolbar = ({
  actions,
  className,
  leftActions,
  rightActions,
}: EditorToolbarProps) => {
  const renderAction = (action: EditorToolbarAction, index: number) => (
    <Button
      key={index}
      variant={action.variant || "ghost"}
      size={action.size || "sm"}
      onClick={action.onClick}
      disabled={action.disabled}
      className={cn("h-8 px-3 text-xs", action.className)}
    >
      {action.icon}
      {action.label}
    </Button>
  );

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Left actions */}
      <div className="flex items-center gap-2">{leftActions?.map(renderAction)}</div>

      {/* Center actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">{actions.map(renderAction)}</div>
      )}

      {/* Right actions */}
      <div className="flex items-center gap-2">{rightActions?.map(renderAction)}</div>
    </div>
  );
};
