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
import React, { useCallback, useState } from "react";
import { ModalContext } from "./context";
import type { ModalOptions, ModalState } from "./types";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    options: {},
  });
  const [isOkLoading, setIsOkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    setState(prev => {
      prev.options.afterClose?.();
      return { ...prev, isOpen: false };
    });
  }, []);

  const show = useCallback((options: ModalOptions) => {
    setState({ isOpen: true, options });
    setIsOkLoading(false);
    setError(null);
  }, []);

  const confirm = useCallback(
    (options: Omit<ModalOptions, "content">) => {
      show({
        ...options,
        okText: options.okText ?? "Confirm",
        cancelText: options.cancelText ?? "Cancel",
      });
    },
    [show]
  );

  const handleOk = async () => {
    setIsOkLoading(true);
    setError(null);
    try {
      await state.options.onOk?.();
      setState(prev => {
        prev.options.afterClose?.();
        return { ...prev, isOpen: false };
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      console.error("Modal onOk error:", err);
      setError(msg);
    } finally {
      // Keep dialog open on error; close already handled on success path above
      setIsOkLoading(false);
    }
  };

  const handleCancel = () => {
    state.options.onCancel?.();
    setState(prev => {
      prev.options.afterClose?.();
      return { ...prev, isOpen: false };
    });
  };

  return (
    <ModalContext.Provider value={{ show, confirm, close }}>
      {children}
      <Dialog open={state.isOpen} onOpenChange={open => !open && handleCancel()}>
        <DialogContent className={cn(state.options.className)}>
          {state.options.title && (
            <DialogHeader>
              <DialogTitle>{state.options.title}</DialogTitle>
              {state.options.description && (
                <DialogDescription>{state.options.description}</DialogDescription>
              )}
            </DialogHeader>
          )}

          {state.options.content}

          {error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {state.options.showFooter !== false && (
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel} disabled={isOkLoading}>
                {state.options.cancelText ?? "Cancel"}
              </Button>
              <Button
                onClick={handleOk}
                disabled={isOkLoading}
                variant={state.options.okVariant === "destructive" ? "destructive" : undefined}
              >
                {isOkLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {state.options.okLoadingText ?? state.options.okText ?? "Processing..."}
                  </div>
                ) : (
                  state.options.okText ?? "Confirm"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}
