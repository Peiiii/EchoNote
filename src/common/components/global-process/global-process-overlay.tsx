import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/common/components/ui/dialog";
import { Progress } from "@/common/components/ui/progress";
import { useGlobalProcessStore } from "@/core/stores/global-process.store";
import { getFeaturesConfig } from "@/core/config/features.config";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export const GlobalProcessOverlay = () => {
  const { visible, process } = useGlobalProcessStore();
  const open = visible && !!process;

  if (!open || !process) return null;

  const { title, message, progress, steps, status, dismissible, displayMode } = process;

  const StatusIcon = () => {
    if (status === "success") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === "error") return <XCircle className="w-5 h-5 text-red-500" />;
    return <Loader2 className="w-5 h-5 animate-spin" />;
  };

  if (displayMode === "fullscreen") {
    const branding = getFeaturesConfig().ui?.globalProcess?.branding;
    return (
      <div
        aria-live="polite"
        aria-busy={status === "running"}
        role="dialog"
        className="fixed inset-0 z-50 bg-background select-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      >
        {branding?.enabled && (
          <div className="absolute top-6 left-6 text-sm text-muted-foreground">
            {branding.brandName || "StillRoot"}
          </div>
        )}
        <div className="h-full w-full flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center gap-2">
              <StatusIcon />
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            {message && <p className="text-muted-foreground text-sm">{message}</p>}
            <Progress value={progress} />
            {steps && steps.length > 0 && (
              <div className="space-y-2">
                {steps.map(step => (
                  <div key={step.id} className="flex items-center gap-2 text-sm">
                    {step.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />)
                      : step.status === "error" ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    <span className="text-foreground/90">{step.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: dialog mode
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={!!dismissible} className="sm:max-w-md select-none">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <StatusIcon />
            <DialogTitle>{title}</DialogTitle>
          </div>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">
          <Progress value={progress} />
          {steps && steps.length > 0 && (
            <div className="space-y-2">
              {steps.map(step => (
                <div key={step.id} className="flex items-center gap-2 text-sm">
                  {step.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : step.status === "error" ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span className="text-foreground/90">{step.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
