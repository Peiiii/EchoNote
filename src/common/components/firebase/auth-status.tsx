import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { LoginButton } from "@/common/features/auth/components/login-button";
import { UserProfile } from "./user-profile";

export const AuthStatus = () => {
  const { user } = useFirebaseAuth();

  // 根据用户登录状态显示不同组件
  if (!user) {
    return <LoginButton />;
  }

  return <UserProfile user={user} />;
};
