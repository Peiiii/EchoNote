import { Button } from "@/common/components/ui/button";
import { useAuthStore } from "@/core/stores/auth.store";
import { LogIn } from "lucide-react";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { useTranslation } from "react-i18next";

export const LoginButton = () => {
  const { t } = useTranslation();
  const { currentUser, signOut } = useAuthStore();

  const handleLogin = async () => {
    openLoginModal();
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (currentUser) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{t('auth.loginButton.hello', { name: currentUser.displayName })}</span>
        <Button onClick={handleLogout} variant="outline" size="sm">
          {t('auth.userProfile.signOut')}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label={t('auth.loginButton.signInWithGoogle')}
    >
      <LogIn className="w-4 h-4 text-slate-600 dark:text-slate-400" />
    </Button>
  );
};
