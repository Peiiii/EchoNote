import { modal } from "@/common/components/modal/modal.store";
import { LoginModalContent } from "@/common/features/auth/components/login-modal-content";
import { hasGuestWorkspace } from "@/core/services/guest-id";
import { useAuthStore } from "@/core/stores/auth.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { i18n } from "@/common/i18n";

export function openLoginModal(options?: {
  title?: string;
  description?: string;
  allowGuest?: boolean;
}) {
  const defaultTitle = options?.allowGuest
    ? i18n.t("auth.login.titleOrLocal")
    : i18n.t("auth.login.title");
  const defaultDescription = options?.allowGuest
    ? i18n.t("auth.login.descOrLocal")
    : i18n.t("auth.login.description");

  modal.show({
    title: options?.title ?? defaultTitle,
    description: options?.description ?? defaultDescription,
    showFooter: false,
    className: "w-full max-w-[560px] sm:max-w-[560px]",
    content: <LoginModalContent allowGuest={options?.allowGuest} />,
    onCancel: () => {
      if (!options?.allowGuest) return;
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser) return;
      if (hasGuestWorkspace()) return;
      void useNotesDataStore.getState().initGuestWorkspace();
    },
  });
}
