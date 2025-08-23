import { MobileSetupApp } from "./mobile-setup-app";
import { mobileChatExtension } from "./features/chat";

export const MobileApp = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <MobileSetupApp extensions={[mobileChatExtension]} />
    </div>
  );
};