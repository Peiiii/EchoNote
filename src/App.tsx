import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { useChatViewStore } from "@/core/stores/chat-view-store";
import { DesktopApp } from "@/desktop/desktop-app";
import { MobileApp } from "@/mobile/mobile-app";
import { useEffect } from "react";
import { AppSkeleton } from "@/common/components/ui/skeleton";
import { useSmartLoading } from "@/common/hooks/use-smart-loading";

export const App = () => {
  const { isMobile } = useBreakpoint();
  const { loading, user } = useFirebaseAuth();
  const setAuth = useChatViewStore((state) => state.setAuth);
  
  // 使用智能 Loading 系统
  const { shouldShowSkeleton } = useSmartLoading(loading, {
    minDisplayTime: 600, // 最小显示 600ms
  });

  // 同步认证状态到chat-view-store
  useEffect(() => {
    setAuth(user);
  }, [user, setAuth]);

  // 显示骨架屏或应用
  if (shouldShowSkeleton) {
    return <AppSkeleton />;
  }

  // 加载完成，显示应用
  return isMobile ? <MobileApp /> : <DesktopApp />;
};
