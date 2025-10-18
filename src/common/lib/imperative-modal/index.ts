import { ReactNode } from "react";
import { modalManager } from "./modal-manager";
import { ModalOptions, ModalController } from "./types";

export const modal = {
  show: (content: ReactNode, options?: ModalOptions): ModalController => 
    modalManager.show(content, options),
    
  hide: (id: string, result?: unknown): void => 
    modalManager.hide(id, result),
    
  hideAll: (): void => 
    modalManager.hideAll(),
};

export { ModalRenderer } from "./modal-renderer";
export type { ModalOptions, ModalController } from "./types";
