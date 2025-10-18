import { DesktopSetupApp } from "./desktop-setup-app";
import { notesExtension } from "./features/notes/extensions";
import { ModalRenderer } from "@/common/lib/imperative-modal";

export const DesktopApp = () => {
  return (
    <div className="h-screen flex flex-col">
      <DesktopSetupApp
        extensions={[
          // demoExtension,
          notesExtension,
          // githubExtension,
        ]}
      />
      <ModalRenderer />
    </div>
  );
};
