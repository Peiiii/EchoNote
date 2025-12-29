import { createContext, useContext } from "react";
import { MobilePresenter } from "@/mobile/services/mobile-presenter";

export const MobilePresenterContext = createContext<MobilePresenter | null>(null);

export const useMobilePresenterContext = () => {
  const context = useContext(MobilePresenterContext);
  if (!context) {
    throw new Error("useMobilePresenter must be used within a MobilePresenterProvider");
  }
  return context;
};