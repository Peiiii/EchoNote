import { modal } from "@/common/components/modal/modal.store";
import { EmailLoginForm } from "@/common/features/auth/components/email-login-form";
import { LoginMethodSelector } from "@/common/features/auth/components/login-method-selector";
import { useAuthStore } from "@/core/stores/auth.store";
import { useEffect, useState } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Button } from "@/common/components/ui/button";
import { useTranslation } from "react-i18next";
import { useGoogleAuthSupport } from "@/common/hooks/use-google-auth-support";
import { ArrowLeft } from "lucide-react";
import { LanguageToggle } from "@/common/components/language-toggle";

type LoginStep = "select" | "email";

export function LoginModalContent({ allowGuest }: { allowGuest?: boolean }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const { signInWithGoogle, isAuthenticating } = useAuthStore();
  const initGuestWorkspace = useNotesDataStore((s) => s.initGuestWorkspace);
  const { t } = useTranslation();
  const { isGoogleAuthSupported } = useGoogleAuthSupport();

  const [step, setStep] = useState<LoginStep>("select");
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    if (currentUser) modal.close();
  }, [currentUser]);

  const handleGoogleLogin = async () => {
    try {
      setGoogleError("");
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("Google login failed:", error);
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case "auth/popup-closed-by-user":
          setGoogleError(t("auth.loginCard.errors.popupClosed"));
          break;
        case "auth/popup-blocked":
          setGoogleError(t("auth.loginCard.errors.popupBlocked"));
          break;
        case "auth/network-request-failed":
          setGoogleError(t("auth.loginCard.errors.networkError"));
          break;
        case "auth/too-many-requests":
          setGoogleError(t("auth.loginCard.errors.tooManyRequests"));
          break;
        default:
          setGoogleError(t("auth.loginCard.errors.googleSignInFailed"));
      }
    }
  };

  const handleLocalMode = async () => {
    await initGuestWorkspace({ autoCreateDefaultSpace: true });
    modal.close();
  };

  const handleSelectEmail = () => {
    setStep("email");
  };

  const handleBackToSelect = () => {
    setStep("select");
    setGoogleError("");
  };

  // If Google is not supported and guest mode is not allowed,
  // skip selection and go directly to email form
  const shouldShowSelector =
    step === "select" && (isGoogleAuthSupported || allowGuest);

  if (shouldShowSelector) {
    return (
      <div className="space-y-4">
        {googleError && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-3">
            {googleError}
          </div>
        )}
        <LoginMethodSelector
          onSelectGoogle={handleGoogleLogin}
          onSelectEmail={handleSelectEmail}
          onSelectLocal={handleLocalMode}
          isAuthenticating={isAuthenticating}
          showLocalOption={allowGuest}
        />
      </div>
    );
  }

  // Email login step
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToSelect}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground -ml-2 mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("auth.login.backToOptions")}
      </Button>
      <EmailLoginForm />
      <div className="pt-2">
        <LanguageToggle />
      </div>
    </div>
  );
}
