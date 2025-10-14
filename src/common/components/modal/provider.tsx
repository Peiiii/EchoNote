import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { cn } from "@/common/lib/utils";
import { useModalStore } from "@/core/stores/modal.store";
import React from "react";

// This component renders the modal dialog and reads state from zustand store
export function ModalProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useModalStore(state => state.isOpen);
  const options = useModalStore(state => state.options);
  const isOkLoading = useModalStore(state => state.isOkLoading);
  const error = useModalStore(state => state.error);
  const handleOk = useModalStore(state => state.handleOk);
  const handleCancel = useModalStore(state => state.handleCancel);

  return (
    <>
      {children}
      <Dialog open={isOpen} onOpenChange={open => !open && handleCancel()}>
        <DialogContent className={cn(options.className)}>
          {options.title && (
            <DialogHeader>
              <DialogTitle>{options.title}</DialogTitle>
              {options.description && <DialogDescription>{options.description}</DialogDescription>}
            </DialogHeader>
          )}

          {options.content}

          {error && <div className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</div>}

          {options.showFooter !== false && (
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel} disabled={isOkLoading}>
                {options.cancelText ?? "Cancel"}
              </Button>
              <Button
                onClick={handleOk}
                disabled={isOkLoading}
                variant={options.okVariant === "destructive" ? "destructive" : undefined}
              >
                {isOkLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {options.okLoadingText ?? options.okText ?? "Processing..."}
                  </div>
                ) : (
                  options.okText ?? "Confirm"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
