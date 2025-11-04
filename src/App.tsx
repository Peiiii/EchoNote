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
import { useLocation } from "react-router-dom";

export const App = () => {
  const { currentBreakpoint } = useBreakpoint();
  const { user, isInitializing } = useFirebaseAuth();
  const location = useLocation();
  const sessionStartTime = useRef<number>(Date.now());
  const setNotesViewAuth = useNotesViewStore(state => state.setAuth);

  const isPublicSpaceRoute = location.pathname.startsWith("/space/");

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

  if (isInitializing && !isPublicSpaceRoute) {
    return (
      <>
        <GlobalProcessOverlay />
        <AppSkeleton />
        <Toaster />
      </>
    );
  }

  if (!user && !isPublicSpaceRoute) {
    return (
      <>
        {/* <GlobalProcessOverlay /> */}
        <LoginPage />
        <Toaster />
      </>
    );
  }

  if (!user && isPublicSpaceRoute) {
    return (
      <>
        <GlobalProcessOverlay />
        {currentBreakpoint === "sm" ? <MobileApp /> : <DesktopApp />}
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
