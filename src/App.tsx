import { useBreakpoint } from "@/common/components/breakpoint-provider";
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
import { GuestEntryPrompter } from "@/common/features/auth/components/guest-entry-prompter";
import { Routes, Route, useLocation } from "react-router-dom";
import { LandingRouter } from "@/landing/landing-router";

export const App = () => {
  const { currentBreakpoint } = useBreakpoint();
  const { user } = useFirebaseAuth();
  const sessionStartTime = useRef<number>(Date.now());
  const setNotesViewAuth = useNotesViewStore(state => state.setAuth);
  const location = useLocation();

  const isLandingPage = location.pathname.startsWith("/landing");

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

  // Show landing page if on /landing route
  if (isLandingPage) {
    return (
      <>
        <Routes>
          <Route path="/landing/*" element={<LandingRouter />} />
        </Routes>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <GuestEntryPrompter />
      <GlobalProcessOverlay />
      {currentBreakpoint === "sm" ? <MobileApp /> : <DesktopApp />}
      <Toaster />
      <PWAStatusIndicator />
      <PWAInstallPrompt />
      <PWAUpdatePrompt />
    </>
  );
};
