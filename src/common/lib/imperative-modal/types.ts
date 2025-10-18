import { ReactNode } from "react";

export interface ModalOptions {
  className?: string;
  onClose?: (result?: unknown) => void;
  position?: 'center' | 'top';
  topOffset?: number;
}

export interface ModalController {
  close: (result?: unknown) => void;
  id: string;
}

export interface ModalInstance {
  id: string;
  content: ReactNode;
  options: ModalOptions;
  zIndex: number;
}
