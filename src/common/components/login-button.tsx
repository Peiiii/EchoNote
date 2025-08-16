import React from 'react';
import { firebaseAuthService } from '@/common/services/firebase/firebase-auth.service';
import { Button } from '@/common/components/ui/button';
import { useFirebaseAuth } from '@/common/hooks/use-firebase-auth';

export const LoginButton = () => {
  const { user } = useFirebaseAuth();

  const handleLogin = async () => {
    const user = await firebaseAuthService.signInWithGoogle();
    if (user) {
      console.log(`Welcome, ${user.displayName}!`);
      // 登录成功后你什么都不用做！
      // 我们的 onAuthStateChanged 监听器会自动检测到状态变化，
      // 并调用 Zustand store 的 setAuth action，
      // 从而触发整个应用的更新。
    }
  };

  const handleLogout = async () => {
    await firebaseAuthService.signOut();
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">Hello, {user.displayName}</span>
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