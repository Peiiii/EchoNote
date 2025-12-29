import { create } from "zustand";
import type { ModalOptions } from "@/common/components/modal/types";

interface ModalStoreState {
  isOpen: boolean;
  options: ModalOptions;
  isOkLoading: boolean;
  error: string | null;
  // actions
  show: (options: ModalOptions) => void;
  confirm: (options: Omit<ModalOptions, "content">) => void;
  close: () => void;
  handleOk: () => Promise<void>;
  handleCancel: () => void;
}

export const useModalStore = create<ModalStoreState>()((set, get) => ({
  isOpen: false,
  options: {},
  isOkLoading: false,
  error: null,

  show: options => {
    set({ isOpen: true, options, isOkLoading: false, error: null });
  },

  confirm: options => {
    get().show({
      ...options,
      okText: options.okText ?? "Confirm",
      cancelText: options.cancelText ?? "Cancel",
    });
  },

  close: () => {
    set({ isOpen: false });
  },

  handleOk: async () => {
    const { options } = get();
    set({ isOkLoading: true, error: null });
    try {
      await options.onOk?.();
      const afterClose = get().options.afterClose;
      set({ isOpen: false });
      afterClose?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      // keep the dialog open and show error
      set({ error: msg });
    } finally {
      set({ isOkLoading: false });
    }
  },

  handleCancel: () => {
    const { options } = get();
    options.onCancel?.();
    const afterClose = options.afterClose;
    set({ isOpen: false });
    afterClose?.();
  },
}));

// Simple facade for non-hook usage
export const modal = {
  show: (options: ModalOptions) => useModalStore.getState().show(options),
  confirm: (options: Omit<ModalOptions, "content">) =>
    useModalStore.getState().confirm(options),
  close: () => useModalStore.getState().close(),
};
