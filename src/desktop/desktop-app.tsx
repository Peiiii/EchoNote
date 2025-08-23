import { SetupApp } from "@/core/components/setup-app";
import { chatExtension } from "./features/chat";

export const DesktopApp = () => {
  return (
    <div className="h-screen flex flex-col">
      <SetupApp
        extensions={[
          // demoExtension,
          chatExtension,
          // githubExtension,
        ]}
      />
    </div>
  );
};
