import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { LoginPage } from "@/common/features/auth/components/login-page";
import { AppSkeleton } from "@/common/components/ui/skeleton";
import { Toaster } from "@/common/components/ui/sonner";
import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { DesktopApp } from "@/desktop/desktop-app";
import { MobileApp } from "@/mobile/mobile-app";
import { useEffect } from "react";

export const App = () => {
  const { currentBreakpoint } = useBreakpoint();
  const { user, isInitializing } = useFirebaseAuth();
  const setChatViewAuth = useChatViewStore((state) => state.setAuth);

  useEffect(() => {
    setChatViewAuth(user);
  }, [user, setChatViewAuth]);

  if (isInitializing) {
    return (
      <>
        <AppSkeleton />
        <Toaster />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {currentBreakpoint === 'sm' ? <MobileApp /> : <DesktopApp />}
      <Toaster />
    </>
  );
};

