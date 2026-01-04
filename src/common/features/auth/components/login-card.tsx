import { useGoogleAuthSupport } from "@/common/hooks/use-google-auth-support";
import { useAuthStore } from "@/core/stores/auth.store";
import { useEffect, useState } from "react";
import { EmailPasswordForm } from "./email-password-form";
import { LoginFooter } from "./login-footer";
import { SocialLogin } from "./social-login";
import { AuthProgress } from "./auth-progress";
import { AuthStep, AuthMessage, AuthProgress as AuthProgressEnum } from "@/common/types/auth.types";
import { useTranslation } from "react-i18next";

type LoginCardProps = {
  className?: string;
};

export const LoginCard = ({ className }: LoginCardProps) => {
  const { t } = useTranslation();
  const {
    signInWithGoogle,
    signInWithEmail,
    sendSignUpLink,
    sendPasswordReset,
    sendEmailVerification,
    isAuthenticating,
    setAuthStep,
  } = useAuthStore();

  const { isGoogleAuthSupported } = useGoogleAuthSupport();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ email: string } | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("Google login failed:", error);
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case "auth/popup-closed-by-user":
          setError(t('auth.loginCard.errors.popupClosed'));
          break;
        case "auth/popup-blocked":
          setError(t('auth.loginCard.errors.popupBlocked'));
          break;
        case "auth/network-request-failed":
          setError(t('auth.loginCard.errors.networkError'));
          break;
        case "auth/too-many-requests":
          setError(t('auth.loginCard.errors.tooManyRequests'));
          break;
        default:
          setError(t('auth.loginCard.errors.googleSignInFailed'));
      }
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !password) {
      setError(t('auth.loginCard.errors.fillAllFields'));
      return;
    }

    if (isSignUp) {
      if (!confirmPassword) {
        setError(t('auth.loginCard.errors.confirmPassword'));
        return;
      }
      if (password !== confirmPassword) {
        setError(t('auth.loginCard.errors.passwordsNotMatch'));
        return;
      }
      if (password.length < 6) {
        setError(t('auth.loginCard.errors.passwordTooShort'));
        return;
      }
    }

    try {
      setError("");
      setStatusMessage("");

      if (isSignUp) {
        setIsSignUpModalOpen(true);
        setAuthStep(
          AuthStep.AUTHENTICATING,
          AuthMessage.CREATING_ACCOUNT,
          AuthProgressEnum.AUTHENTICATING
        );
        const result = await sendSignUpLink(email, password);
        if (result.verificationSent) {
          setAuthStep(
            AuthStep.VERIFYING_EMAIL,
            AuthMessage.SENDING_VERIFICATION,
            AuthProgressEnum.VERIFYING_EMAIL
          );
          setPendingUser({ email });
          setIsEmailVerificationSent(true);
          setResendCooldown(60);
        }
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: unknown) {
      console.error("Email auth failed:", error);
      setStatusMessage("");

      const firebaseError = error as { code?: string; message?: string };
      let errorMessage = "";
      switch (firebaseError.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled. Please contact support.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection and try again.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "This sign-in method is not enabled. Please try a different method.";
          break;
        default:
          if (firebaseError.message === "EMAIL_NOT_VERIFIED") {
            errorMessage =
              "Please verify your email address before signing in. Check your inbox for a verification link.";
          } else if (firebaseError.message === "EMAIL_NOT_VERIFIED_RESENT") {
            errorMessage =
              "Please verify your email address before signing in. We've sent a new verification link to your inbox.";
          } else if (firebaseError.message === "EMAIL_ALREADY_VERIFIED") {
            errorMessage = "This email is already verified. Please sign in instead.";
          } else if (firebaseError.message === "ACCOUNT_EXISTS_WRONG_PASSWORD") {
            errorMessage =
              "An account with this email already exists, but the password is incorrect. Please check your password or try signing in.";
          } else {
            errorMessage = "Authentication failed. Please check your credentials and try again.";
          }
      }

      setError(errorMessage);
      try {
        setAuthStep(
          AuthStep.ERROR,
          isSignUp ? "Sign-up failed. Please try again." : AuthMessage.SIGN_IN_FAILED,
          AuthProgressEnum.START
        );
      } catch {
        // ignore
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setError("");
      await sendPasswordReset(email);
      setIsPasswordReset(true);
    } catch (error: unknown) {
      console.error("Password reset failed:", error);
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case "auth/user-not-found":
          setError("No account found with this email address");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/too-many-requests":
          setError("Too many reset attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection and try again.");
          break;
        default:
          setError("Failed to send password reset email. Please try again.");
      }
    }
  };

  const handleResendVerification = async () => {
    if (!pendingUser) {
      setError("No pending user found");
      return;
    }

    try {
      if (resendCooldown > 0) {
        setError(`Please wait ${resendCooldown} seconds before resending`);
        return;
      }

      setIsResending(true);
      setError("");
      setIsEmailVerificationSent(false);
      setAuthStep(
        AuthStep.VERIFYING_EMAIL,
        AuthMessage.SENDING_VERIFICATION,
        AuthProgressEnum.VERIFYING_EMAIL
      );

      await sendEmailVerification();
      setIsEmailVerificationSent(true);
      setResendCooldown(60);
    } catch (error: unknown) {
      console.error("Failed to resend verification:", error);
      const firebaseError = error as { code?: string; message?: string };

      switch (firebaseError.code) {
        case "auth/too-many-requests":
          setError("Too many verification attempts. Please try again later.");
          setResendCooldown(120);
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection and try again.");
          break;
        default:
          setError("Failed to resend verification email. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    setIsSignUp(false);
    setIsEmailVerificationSent(false);
    setIsSignUpModalOpen(false);
    setError("");
    setStatusMessage("");
    setPendingUser(null);
    setResendCooldown(0);
    setPassword("");
    setConfirmPassword("");
    setIsResending(false);
  };

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setStatusMessage("");
    setIsPasswordReset(false);
    setIsEmailVerificationSent(false);
    setPendingUser(null);
    setConfirmPassword("");
    setResendCooldown(0);
    setIsResending(false);
  };

  const handleAuthProgressClose = () => {
    setIsSignUpModalOpen(false);
    setIsEmailVerificationSent(false);
    setPendingUser(null);
    setError("");
    setResendCooldown(0);
    setIsResending(false);
  };

  return (
    <div className={className}>
      {isGoogleAuthSupported && (
        <>
          <SocialLogin onGoogleLogin={handleGoogleLogin} isAuthenticating={isAuthenticating} />
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {t('auth.login.or')}
              </span>
            </div>
          </div>
        </>
      )}

      <EmailPasswordForm
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        isSignUp={isSignUp}
        isAuthenticating={isAuthenticating}
        error={error}
        statusMessage={statusMessage}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onToggleSignUp={handleToggleSignUp}
        onPasswordReset={handlePasswordReset}
        onSubmit={handleEmailSubmit}
      />

      <AuthProgress
        isEmailVerificationSent={isEmailVerificationSent}
        email={email}
        onResendVerification={handleResendVerification}
        onBackToSignIn={handleBackToSignIn}
        isSignUpFlow={isSignUp || isEmailVerificationSent}
        forceOpen={isSignUpModalOpen}
        onClose={handleAuthProgressClose}
        resendCooldown={resendCooldown}
        isResending={isResending}
      />

      {isPasswordReset && (
        <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg p-3">
          {t('auth.login.passwordResetSent')}
        </div>
      )}

      <LoginFooter />
    </div>
  );
};
