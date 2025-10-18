import { modal } from "@/common/lib/imperative-modal";
import { QuickSearchContent } from "./quick-search-content";

export function openQuickSearchModal() {
  let modalController: ReturnType<typeof modal.show> | null = null;
  modalController = modal.show({
    content: <QuickSearchContent onClose={() => modalController?.close()} />,
    className: [
      "w-screen max-w-none h-svh max-h-none rounded-none",
      "sm:w-full sm:rounded-lg",
      "sm:max-w-xl",
      "sm:h-[80vh] sm:max-h-[80vh]",
    ].join(" "),
    position: "top",
    topOffset: 12,
  });

  return modalController;
}
