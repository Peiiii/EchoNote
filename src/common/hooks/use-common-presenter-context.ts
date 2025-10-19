import { createContext, useContext } from "react";
import { CommonPresenter } from "../common-presenter";

export const CommonPresenterContext = createContext<CommonPresenter | null>(null);

export const useCommonPresenterContext = () => {
  const context = useContext(CommonPresenterContext);
  if (!context) {
    throw new Error("useCommonPresenter must be used within a CommonPresenterProvider");
  }
  return context;
};