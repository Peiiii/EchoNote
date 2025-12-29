import { modalManager } from "./modal-manager";
import { ModalController, ModalOptions } from "./types";

export const modal = {
  show: (options: ModalOptions): ModalController => 
    modalManager.show(options),
    
  hide: (id: string, result?: unknown): void => 
    modalManager.hide(id, result),
    
  hideAll: (): void => 
    modalManager.hideAll(),
};

export { ModalRenderer } from "./modal-renderer";
export type { ModalController, ModalOptions } from "./types";

