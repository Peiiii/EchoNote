import { create } from "zustand";

interface ModalState {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export const useQuickSearchModalStore = create<ModalState>(set => ({
  open: false,
  setOpen: v => set({ open: v }),
}));

export const openQuickSearchModal = () => useQuickSearchModalStore.getState().setOpen(true);
export const closeQuickSearchModal = () => useQuickSearchModalStore.getState().setOpen(false);
