import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { auth } from "@/common/config/firebase.config";
import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { useChatViewStore } from "@/core/stores/chat-view-store";
import { DesktopApp } from "@/desktop/desktop-app";
import { MobileApp } from "@/mobile/mobile-app";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { AppSkeleton } from "@/common/components/ui/skeleton";
import { useSmartLoading } from "@/common/hooks/use-smart-loading";

export const App = () => {
  const { isMobile } = useBreakpoint();
  const { loading } = useFirebaseAuth();
  const setAuth = useChatViewStore((state) => state.setAuth);
  
  // 使用智能 Loading 系统
  const { shouldShowSkeleton } = useSmartLoading(loading, {
    minDisplayTime: 600, // 最小显示 600ms
  });

  // 启动对 Firebase Auth 状态的全局监听
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 无论用户是通过 Google 登录、刷新页面、还是关闭浏览器后重开，
      // 这个监听器都会被触发，并将最新的用户状态 (user 或 null)
      // 更新到我们的 Zustand store 中。
      setAuth(user);
    });

    // 在组件卸载时，清理监听器
    return () => unsubscribe();
  }, [setAuth]);

  // 显示骨架屏或应用
  if (shouldShowSkeleton) {
    return <AppSkeleton />;
  }

  // 加载完成，显示应用
  return isMobile ? <MobileApp /> : <DesktopApp />;
};
