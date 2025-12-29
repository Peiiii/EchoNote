import { CommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { ModalRenderer } from "@/common/lib/imperative-modal";
import { useMemo } from "react";
import { DesktopSetupApp } from "./desktop-setup-app";
import { notesExtension } from "./features/notes/extensions";
import { demoExtension } from "./features/demo/extensions/demo-extension";
import { feedbackExtension } from "./features/feedback/extensions";
import { DesktopPresenterContext } from "./hooks/use-desktop-presenter-context";
import { DesktopPresenter } from "./services/desktop-presenter";

export const DesktopApp = () => {
  const desktopPresenter = useMemo(() => new DesktopPresenter(), []);
  
  // Only include demo extension in development
  const extensions = useMemo(() => {
    const baseExtensions = [notesExtension, feedbackExtension];
    
    // Add demo extension only in development
    if (import.meta.env.DEV) {
      baseExtensions.unshift(demoExtension);
    }
    
    return baseExtensions;
  }, []);

  return (
    <DesktopPresenterContext.Provider value={desktopPresenter}>
      <CommonPresenterContext.Provider value={desktopPresenter}>
      <div className="h-screen flex flex-col">
        <DesktopSetupApp
          extensions={extensions}
        />
        <ModalRenderer />
      </div>
      </CommonPresenterContext.Provider>
    </DesktopPresenterContext.Provider>
  );
};
