import { Button } from "@/common/components/ui/button";
import { useAuthStore } from "@/core/stores/auth.store";
import { LogIn } from "lucide-react";
import { openLoginModal } from "@/common/features/auth/open-login-modal";

export const LoginButton = () => {
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
        <span className="text-sm">Hello, {currentUser.displayName}</span>
        <Button onClick={handleLogout} variant="outline" size="sm">
          Logout
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
      aria-label="Sign in with Google"
    >
      <LogIn className="w-4 h-4 text-slate-600 dark:text-slate-400" />
    </Button>
  );
};
