import { Button } from "@/common/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface ConfirmFooterProps {
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmIcon?: React.ReactNode; // shown when not loading
  loadingLabel?: string; // fallback to confirmLabel with ...
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
}

export function ConfirmFooter({
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading,
  confirmIcon,
  loadingLabel,
  variant = "default",
}: ConfirmFooterProps) {
  return (
    <div className="flex gap-2 pt-2">
      <Button onClick={onConfirm} disabled={isLoading} className="flex-1" variant={variant}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {loadingLabel || `${confirmLabel}...`}
          </>
        ) : (
          <>
            {confirmIcon}
            {confirmIcon ? <span className="ml-2">{confirmLabel}</span> : confirmLabel}
          </>
        )}
      </Button>
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        {cancelLabel}
      </Button>
    </div>
  );
}
