import { Button } from '@/common/components/ui/button';
import { useAuthStore } from '@/core/stores/auth.store';

export const LoginButton = () => {
  const { currentUser, signInWithGoogle, signOut } = useAuthStore();

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

  return (
    <Button onClick={handleLogin}>
      Sign in with Google
    </Button>
  );
};