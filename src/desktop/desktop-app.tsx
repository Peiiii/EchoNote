import { DesktopSetupApp } from "./desktop-setup-app";
import { notesExtension } from "./features/notes/extensions";

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
    </div>
  );
};
