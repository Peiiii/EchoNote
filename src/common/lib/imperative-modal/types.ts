import { ReactNode } from "react";

export interface ModalOptions {
  content: ReactNode;
  className?: string;
  onClose?: (result?: unknown) => void;
  position?: "center" | "top";
  topOffset?: number;
  width?: string | number;
}

export interface ModalController {
  close: (result?: unknown) => void;
  id: string;
}

export interface ModalInstance {
  id: string;
  options: ModalOptions;
  zIndex: number;
}
