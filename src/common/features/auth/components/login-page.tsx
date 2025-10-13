import { useGoogleAuthSupport } from "@/common/hooks/use-google-auth-support";
import { useAuthStore } from "@/core/stores/auth.store";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { AuthMessages } from "./auth-messages";
import { EmailPasswordForm } from "./email-password-form";
import { LoginFooter } from "./login-footer";
import { LoginIllustration } from "./login-illustration";
import { SocialLogin } from "./social-login";
import { AuthProgress } from "./auth-progress";
import { AuthStep, AuthMessage, AuthProgress as AuthProgressEnum } from "@/common/types/auth.types";

export const LoginPage = () => {
  const {
    signInWithGoogle,
    signInWithEmail,
    sendSignUpLink,
    sendPasswordReset,
    sendEmailVerification,
    isAuthenticating,
    setAuthStep,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ email: string } | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("Google login failed:", error);
      const firebaseError = error as { code?: string; message?: string };

      // 处理Google登录的Firebase错误
      switch (firebaseError.code) {
        case "auth/popup-closed-by-user":
          setError("Sign-in was cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setError("Popup was blocked. Please allow popups and try again.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection and try again.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Google sign-in failed. Please try again.");
      }
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // 注册时的额外验证
    if (isSignUp) {
      if (!confirmPassword) {
        setError("Please confirm your password");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
    }

    try {
      setError("");
      setStatusMessage("");

      if (isSignUp) {
        // Show progress in modal: creating account -> sending verification
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
          setError("");
          setStatusMessage("");
        }
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: unknown) {
      console.error("Email auth failed:", error);
      setStatusMessage("");

      // 处理常见的Firebase错误，转换为用户友好的错误信息
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
      // Reflect failure state in modal briefly (only if still authenticating)
      try {
        setAuthStep(
          AuthStep.ERROR,
          isSignUp ? "Sign-up failed. Please try again." : AuthMessage.SIGN_IN_FAILED,
          AuthProgressEnum.START
        );
      } catch {}
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

      // 处理密码重置的Firebase错误
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
      setError("");
      // Show progress in modal while resending
      setIsEmailVerificationSent(false);
      setAuthStep(
        AuthStep.VERIFYING_EMAIL,
        AuthMessage.SENDING_VERIFICATION,
        AuthProgressEnum.VERIFYING_EMAIL
      );
      await sendEmailVerification();
      setIsEmailVerificationSent(true);
    } catch (error: unknown) {
      console.error("Resend verification failed:", error);
      const firebaseError = error as { code?: string; message?: string };

      switch (firebaseError.code) {
        case "auth/too-many-requests":
          setError("Too many verification attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection and try again.");
          break;
        default:
          setError("Failed to resend verification email. Please try again.");
      }
    }
  };

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setIsPasswordReset(false);
    setIsEmailVerificationSent(false);
    setPendingUser(null);
    setConfirmPassword("");
  };

  const handleBackToSignIn = () => {
    setIsEmailVerificationSent(false);
    setPendingUser(null);
    setIsSignUp(false);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const { isGoogleAuthSupported } = useGoogleAuthSupport();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 flex">
      {/* Left Side - Authentication */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Simplified Brand Header */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
            StillRoot
          </span>
        </div>

        <div className="w-full max-w-md">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100/30 to-cyan-100/30 dark:from-emerald-900/20 dark:to-cyan-900/20 animate-pulse"></div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 relative backdrop-blur-sm">
            {isGoogleAuthSupported && (
              <>
                <SocialLogin
                  onGoogleLogin={handleGoogleLogin}
                  isAuthenticating={isAuthenticating}
                />
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      or
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
            />

            {/* Keep only password-reset banner below; email verification moves into modal */}
            <AuthMessages
              error=""
              isPasswordReset={isPasswordReset}
              isEmailVerificationSent={false}
              email={email}
              onResendVerification={handleResendVerification}
              onBackToSignIn={handleBackToSignIn}
              isAuthenticating={isAuthenticating}
            />

            <LoginFooter />
          </div>
        </div>
      </div>

      <LoginIllustration />
    </div>
  );
};
