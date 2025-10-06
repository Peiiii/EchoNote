import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { LoginPage } from "@/common/features/auth/components/login-page";
import { AppSkeleton } from "@/common/components/ui/skeleton";
import { Toaster } from "@/common/components/ui/sonner";
import { PWAInstallPrompt } from "@/common/components/pwa-install-prompt";
import { PWAUpdatePrompt } from "@/common/components/pwa-update-prompt";
import { PWAStatusIndicator } from "@/common/components/pwa-status-indicator";
import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { DesktopApp } from "@/desktop/desktop-app";
import { MobileApp } from "@/mobile/mobile-app";
import { useEffect } from "react";

export const App = () => {
  const { currentBreakpoint } = useBreakpoint();
  const { user, isInitializing } = useFirebaseAuth();
  console.log('[App] ', {
    user,
    isInitializing,
  });
  const setNotesViewAuth = useNotesViewStore((state) => state.setAuth);


  useEffect(() => {
    setNotesViewAuth(user);
  }, [user, setNotesViewAuth]);

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
      <PWAStatusIndicator />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </>
  );
};

