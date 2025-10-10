import { useAuthStore } from "@/core/stores/auth.store";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AuthStep } from "@/common/types/auth.types";
import { Loading } from "@/common/components/ui/loading";
import { Progress } from "@/common/components/ui/progress";
import { Dialog, DialogContent, DialogOverlay } from "@/common/components/ui/dialog";

export const AuthProgress = () => {
  const { authStep, authMessage, authProgress, isAuthenticating } = useAuthStore();

  if (!isAuthenticating || authStep === AuthStep.IDLE) {
    return null;
  }

  const getStepIcon = () => {
    switch (authStep) {
      case AuthStep.COMPLETE:
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case AuthStep.ERROR:
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Loading variant="spinner" size="lg" />;
    }
  };

  const getStepColor = () => {
    switch (authStep) {
      case AuthStep.COMPLETE:
        return 'text-green-600 dark:text-green-400';
      case AuthStep.ERROR:
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <Dialog open={true}>
      <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
      <DialogContent className="max-w-md w-full mx-4 p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            {getStepIcon()}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {authStep === AuthStep.COMPLETE ? 'Welcome!' : 'Signing you in...'}
            </h3>
            <p className={`text-sm font-medium ${getStepColor()}`}>
              {authMessage}
            </p>
            {authStep !== AuthStep.COMPLETE && authStep !== AuthStep.ERROR && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This may take a few moments
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Progress 
              value={authProgress} 
              className={`${
                authStep === AuthStep.ERROR 
                  ? 'bg-red-100 dark:bg-red-900/20' 
                  : authStep === AuthStep.COMPLETE 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-blue-100 dark:bg-blue-900/20'
              }`}
            />
            
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className={`flex items-center gap-2 ${authStep === AuthStep.AUTHENTICATING ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${authStep === AuthStep.AUTHENTICATING ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span>Authenticating</span>
              </div>
              <div className={`flex items-center gap-2 ${authStep === AuthStep.VERIFYING_EMAIL ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${authStep === AuthStep.VERIFYING_EMAIL ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span>Verifying</span>
              </div>
              <div className={`flex items-center gap-2 ${authStep === AuthStep.INITIALIZING_DATA ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${authStep === AuthStep.INITIALIZING_DATA ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span>Setting up</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
