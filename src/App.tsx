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
import { logService, Platform } from "@/core/services/log.service";
import { useEffect, useRef } from "react";
import { GlobalProcessOverlay } from "@/common/components/global-process/global-process-overlay";

export const App = () => {
  const { currentBreakpoint } = useBreakpoint();
  const { user, isInitializing, isRefreshing } = useFirebaseAuth();
  const sessionStartTime = useRef<number>(Date.now());
  console.log("[App] ", {
    user,
    isInitializing,
    isRefreshing,
  });
  const setNotesViewAuth = useNotesViewStore(state => state.setAuth);

  useEffect(() => {
    setNotesViewAuth(user);
  }, [user, setNotesViewAuth]);

  useEffect(() => {
    const platform = currentBreakpoint === "sm" ? Platform.MOBILE : Platform.DESKTOP;
    logService.logAppStart(platform, "1.0.0");
    
    return () => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      logService.logAppClose(sessionDuration);
    };
  }, [currentBreakpoint]);

  // Only show a skeleton during session refresh, not for a fresh (logged-out) visit
  if (isInitializing) {
    return (
      <>
        <GlobalProcessOverlay />
        <AppSkeleton />
        <Toaster />
      </>
    );
  }

  if (!user) {
    // Keep overlay mounted on auth screens as well (e.g., refresh, email link, etc.)
    return (
      <>
        {/* <GlobalProcessOverlay /> */}
        <LoginPage />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <GlobalProcessOverlay />
      {currentBreakpoint === "sm" ? <MobileApp /> : <DesktopApp />}
      <Toaster />
      <PWAStatusIndicator />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </>
  );
};
