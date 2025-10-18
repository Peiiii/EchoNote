import { modal } from "@/common/lib/imperative-modal";
import { QuickSearchContent } from "./quick-search-content";

export function openQuickSearchModal() {
  let modalController: ReturnType<typeof modal.show> | null = null;

  modalController = modal.show({
    content: <QuickSearchContent onClose={() => modalController?.close()} />,
    className: "w-screen max-w-none h-svh sm:max-w-2xl sm:h-auto sm:max-h-[80vh]",
    position: "top",
    topOffset: 12,
  });

  return modalController;
}
