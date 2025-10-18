import { createContext, useContext } from "react";
import { DesktopPresenter } from "../services/desktop-presenter";


export const DesktopPresenterContext = createContext<DesktopPresenter | null>(null);

export const useDesktopPresenterContext = () => {
  const context = useContext(DesktopPresenterContext);
  if (!context) {
    throw new Error("useDesktopPresenter must be used within a DesktopPresenterProvider");
  }
  return context;
};