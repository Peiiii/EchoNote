import { modal } from "@/common/lib/imperative-modal";
import { QuickSearchContent } from "./quick-search-content";

export interface QuickSearchModalOptions {
  /**
   * Tailwind class (or classes) controlling the desktop max width, e.g. "sm:max-w-lg".
   * Defaults to "sm:max-w-xl".
   */
  desktopWidthClass?: string;
  /**
   * Tailwind class controlling the desktop height (should include explicit height + max-height).
   * Defaults to "sm:h-[80vh] sm:max-h-[80vh]" so internal scrolling works reliably.
   */
  desktopHeightClass?: string;
}

export function openQuickSearchModal(options?: QuickSearchModalOptions) {
  let modalController: ReturnType<typeof modal.show> | null = null;

  const desktopWidthClass = options?.desktopWidthClass ?? "sm:max-w-xl";
  const desktopHeightClass = options?.desktopHeightClass ?? "sm:h-[80vh] sm:max-h-[80vh]";

  modalController = modal.show({
    content: <QuickSearchContent onClose={() => modalController?.close()} />,
    className: [
      "w-screen max-w-none h-svh max-h-none rounded-none",
      "sm:w-full sm:rounded-lg",
      desktopWidthClass,
      desktopHeightClass,
    ].join(" "),
    position: "top",
    topOffset: 12,
  });

  return modalController;
}
