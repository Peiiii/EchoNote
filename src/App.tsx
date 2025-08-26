import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { AppSkeleton } from "@/common/components/ui/skeleton";
import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { DesktopApp } from "@/desktop/desktop-app";
import { MobileApp } from "@/mobile/mobile-app";
import { useEffect } from "react";

export const App = () => {
  const { currentBreakpoint } = useBreakpoint();
  const { user } = useFirebaseAuth();
  const setChatViewAuth = useChatViewStore((state) => state.setAuth);

  // 同步认证状态到 chat-view store (保持向后兼容)
  useEffect(() => {
    setChatViewAuth(user);
  }, [user, setChatViewAuth]);

  // 显示骨架屏或应用
  if (!user) {
    return <AppSkeleton />;
  }

  // 加载完成，显示应用
  return currentBreakpoint === 'sm' ? <MobileApp /> : <DesktopApp />;
};
