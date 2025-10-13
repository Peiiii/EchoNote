import { useAuthStore } from "@/core/stores/auth.store";
import { CheckCircle, AlertCircle } from "lucide-react";
import { AuthStep } from "@/common/types/auth.types";
import { Loading } from "@/common/components/ui/loading";
import { Progress } from "@/common/components/ui/progress";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";

interface AuthProgressProps {
  // When true, show the email verification guidance inside the dialog
  isEmailVerificationSent?: boolean;
  email?: string;
  onResendVerification?: () => void;
  onBackToSignIn?: () => void;
}

export const AuthProgress = ({
  isEmailVerificationSent,
  email,
  onResendVerification,
  onBackToSignIn,
}: AuthProgressProps) => {
  const { authStep, authMessage, authProgress, isAuthenticating } = useAuthStore();

  // Open the dialog when authenticating, or when we want to show the email verification guidance
  const shouldOpen = isAuthenticating || isEmailVerificationSent;
  if (!shouldOpen) {
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
      <DialogContent className="max-w-md w-full mx-4 p-8">
        <div className="text-center space-y-6">
          {/* If verification email has been sent, show guidance UI inside the dialog */}
          {isEmailVerificationSent ? (
            <>
              <div className="flex justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Verify your email
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  We've sent a verification link{email ? ' to ' : ''}
                  {email && <strong className="font-semibold">{email}</strong>}.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Click the link to complete registration.</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onResendVerification}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline underline-offset-2 disabled:opacity-50"
                >
                  Resend link
                </button>
                <span className="text-xs text-slate-400">•</span>
                <button
                  onClick={onBackToSignIn}
                  className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline underline-offset-2"
                >
                  Back to sign in
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center">{getStepIcon()}</div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {authStep === AuthStep.COMPLETE
                    ? 'Welcome!'
                    : 'Please wait...'}
                </h3>
                <p className={`text-sm font-medium ${getStepColor()}`}>{authMessage}</p>
                {authStep !== AuthStep.COMPLETE && authStep !== AuthStep.ERROR && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">This may take a few moments</p>
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
