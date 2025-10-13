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
  // When true, render sign-up specific steps instead of sign-in steps
  isSignUpFlow?: boolean;
  // Force the dialog to stay open across transient store flips (prevents flicker)
  forceOpen?: boolean;
  // Callback when dialog should be closed
  onClose?: () => void;
}

// Separate component for sign-in progress
const SignInProgress = ({ authStep, authMessage, authProgress }: {
  authStep: AuthStep;
  authMessage: string;
  authProgress: number;
}) => {
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
    <>
      <div className="flex justify-center">{getStepIcon()}</div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {authStep === AuthStep.COMPLETE ? 'Welcome!' : 'Please wait...'}
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
  );
};

// Separate component for sign-up progress
const SignUpProgress = ({ authStep, authMessage, authProgress }: {
  authStep: AuthStep;
  authMessage: string;
  authProgress: number;
}) => {
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
    <>
      <div className="flex justify-center">{getStepIcon()}</div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {authStep === AuthStep.COMPLETE ? 'Welcome!' : 'Please wait...'}
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
            <span>Creating</span>
          </div>
          <div className={`flex items-center gap-2 ${authStep === AuthStep.VERIFYING_EMAIL ? 'text-blue-600 dark:text-blue-400' : ''}`}>
            <div className={`w-2 h-2 rounded-full ${authStep === AuthStep.VERIFYING_EMAIL ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
            <span>Sending link</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600`} />
            <span>Check inbox</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Separate component for email verification guidance
const EmailVerificationGuidance = ({ 
  email, 
  onResendVerification, 
  onBackToSignIn 
}: {
  email?: string;
  onResendVerification?: () => void;
  onBackToSignIn?: () => void;
}) => {
  return (
    <>
      <div className="flex justify-center">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Check your email
        </h3>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-400">
            We've sent a verification link{email ? ' to ' : ''}
            {email && <strong className="font-semibold">{email}</strong>}.
          </p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-1">
            Click the link to complete registration.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={onResendVerification}
            className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800/30 rounded-lg transition-colors disabled:opacity-50"
          >
            Resend link
          </button>
          <button
            onClick={onBackToSignIn}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </>
  );
};

export const AuthProgress = ({
  isEmailVerificationSent,
  email,
  onResendVerification,
  onBackToSignIn,
  isSignUpFlow,
  forceOpen,
  onClose,
}: AuthProgressProps) => {
  const { authStep, authMessage, authProgress, isAuthenticating } = useAuthStore();

  // Open the dialog when authenticating, or when we want to show the email verification guidance
  // Keep dialog open if either the store says authenticating / verification view
  // OR caller explicitly wants to force it open (e.g., bridging signup step transitions)
  const shouldOpen = !!forceOpen || isAuthenticating || !!isEmailVerificationSent;
  if (!shouldOpen) {
    return null;
  }

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const renderContent = () => {
    // Email verification guidance takes priority
    if (isEmailVerificationSent) {
      return (
        <EmailVerificationGuidance
          email={email}
          onResendVerification={onResendVerification}
          onBackToSignIn={onBackToSignIn}
        />
      );
    }

    // Show appropriate progress based on flow type
    if (isSignUpFlow) {
      return (
        <SignUpProgress
          authStep={authStep}
          authMessage={authMessage}
          authProgress={authProgress}
        />
      );
    }

    return (
      <SignInProgress
        authStep={authStep}
        authMessage={authMessage}
        authProgress={authProgress}
      />
    );
  };

  return (
    <Dialog open={shouldOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-md w-full mx-4 p-8">
        <div className="text-center space-y-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
