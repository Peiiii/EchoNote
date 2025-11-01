import { modal } from "@/common/lib/imperative-modal";
import { QuickSearchContent } from "./quick-search-content";

interface OpenQuickSearchModalOptions {
  defaultScope?: "all" | "current";
}

export function openQuickSearchModal(options?: OpenQuickSearchModalOptions) {
  const { defaultScope = "current" } = options || {};
  let modalController: ReturnType<typeof modal.show> | null = null;
  modalController = modal.show({
    content: (
      <QuickSearchContent
        onClose={() => modalController?.close()}
        defaultScope={defaultScope}
      />
    ),
    className: [
      "w-screen max-w-none h-svh max-h-none rounded-none",
      "sm:w-full sm:rounded-xl",
      "sm:max-w-2xl",
      "sm:h-[70vh] sm:max-h-[70vh]",
    ].join(" "),
    position: "top",
    topOffset: 96,
  });

  return modalController;
}
