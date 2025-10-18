import { CommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { ModalRenderer } from "@/common/lib/imperative-modal";
import { useMemo } from "react";
import { mobileNotesExtension } from "./features/notes";
import { MobilePresenterContext } from "./hooks/use-mobile-presenter-context";
import { MobileSetupApp } from "./mobile-setup-app";
import { MobilePresenter } from "./services/mobile-presenter";

export const MobileApp = () => {
  const mobilePresenter = useMemo(() => new MobilePresenter(), []);
  return (
    <MobilePresenterContext.Provider value={mobilePresenter}>
      <CommonPresenterContext.Provider value={mobilePresenter}>
      <div
        className="flex flex-col bg-background overflow-hidden"
        style={{
          height: "100%",
        }}
      >
        <MobileSetupApp extensions={[mobileNotesExtension]} />
        <ModalRenderer />
      </div>
      </CommonPresenterContext.Provider>
    </MobilePresenterContext.Provider>
  );
};
