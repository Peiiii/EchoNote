import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hasGuestWorkspace } from "@/core/services/guest-id";
import { useAuthStore } from "@/core/stores/auth.store";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { openGuestDataNoticeModal } from "@/common/features/auth/open-guest-data-notice-modal";
import { modal } from "@/common/components/modal/modal.store";

export function GuestEntryPrompter() {
  const location = useLocation();
  const currentUser = useAuthStore(s => s.currentUser);

  useEffect(() => {
    if (currentUser) return;
    if (location.pathname.startsWith("/space/")) return;

    // Always prompt when entering the app (route change) in logged-out mode.
    // If a guest workspace exists, show a notice; otherwise show login modal with a "local experience" option.
    modal.close();
    if (hasGuestWorkspace()) {
      openGuestDataNoticeModal();
    } else {
      openLoginModal({
        title: "登录或本地体验",
        description: "登录后可云同步、发布空间；也可以先用本地模式体验。",
        allowGuest: true,
      });
    }
  }, [location.pathname, currentUser]);

  return null;
}
