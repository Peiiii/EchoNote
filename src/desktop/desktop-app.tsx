import { SetupApp } from "@/core/components/setup-app";
import { demoExtension } from "./features/demo";
import { chatExtension } from "./features/chat";
import { githubExtension } from "./features/github";

export const DesktopApp = () => {
  return (
    <div className="h-screen flex flex-col">
      <SetupApp
        extensions={[
          demoExtension,
          chatExtension,
          githubExtension,
        ]}
      />
    </div>
  );
};
