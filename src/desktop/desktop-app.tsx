import { DesktopSetupApp } from "./desktop-setup-app";
import { chatExtension } from "./features/chat";

export const DesktopApp = () => {
  return (
    <div className="h-screen flex flex-col">
      <DesktopSetupApp
        extensions={[
          // demoExtension,
          chatExtension,
          // githubExtension,
        ]}
      />
    </div>
  );
};
