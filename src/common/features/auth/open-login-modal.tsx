import { modal } from "@/common/components/modal/modal.store";
import { LoginModalContent } from "@/common/features/auth/components/login-modal-content";

export function openLoginModal(options?: {
  title?: string;
  description?: string;
  allowGuest?: boolean;
}) {
  modal.show({
    title: options?.title ?? "Sign in",
    description: options?.description ?? "Sign in to enable cloud features like publishing and sync.",
    showFooter: false,
    className: "w-full max-w-[560px] sm:max-w-[560px]",
    content: <LoginModalContent allowGuest={options?.allowGuest} />,
  });
}
