import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hasGuestWorkspace } from "@/core/services/guest-id";
import { useAuthStore } from "@/core/stores/auth.store";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { openGuestDataNoticeModal } from "@/common/features/auth/open-guest-data-notice-modal";
import { modal } from "@/common/components/modal/modal.store";
import { firebaseConfig } from "@/common/config/firebase.config";

export function GuestEntryPrompter() {
  const location = useLocation();
  const currentUser = useAuthStore(s => s.currentUser);
  const sessionMode = useAuthStore(s => s.sessionMode);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (sessionMode === "booting") return;
      if (currentUser) return;
      if (location.pathname.startsWith("/space/")) return;

      // For first-time visitors, region detection may trigger a reload to swap auth strategy.
      // Delay the login prompt until region is settled to avoid a flash of "no Google login" → reload → "with Google login".
      await firebaseConfig.whenRegionReadyForUi();
      if (cancelled) return;

      const { currentUser: latestUser, sessionMode: latestMode } = useAuthStore.getState();
      if (latestMode === "booting") return;
      if (latestUser) return;
      if (location.pathname.startsWith("/space/")) return;

      // Always prompt when entering the app (route change) in logged-out mode.
      // If a guest workspace exists, show a notice; otherwise show login modal with a "local experience" option.
      modal.close();
      if (hasGuestWorkspace()) {
        openGuestDataNoticeModal();
      } else {
        openLoginModal({
          allowGuest: true,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, currentUser, sessionMode]);

  return null;
}
