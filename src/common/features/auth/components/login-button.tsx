import { Button } from "@/common/components/ui/button";
import { useAuthStore } from "@/core/stores/auth.store";
import { useGoogleAuthSupport } from "@/common/hooks/use-google-auth-support";
import { LogIn } from "lucide-react";

export const LoginButton = () => {
  const { currentUser, signInWithGoogle, signOut } = useAuthStore();
  const { isGoogleAuthSupported } = useGoogleAuthSupport();

  const handleLogin = async () => {
    await signInWithGoogle();
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

  if (!isGoogleAuthSupported) {
    return null;
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
