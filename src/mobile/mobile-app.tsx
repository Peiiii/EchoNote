import { MobileSetupApp } from "./mobile-setup-app";
import { mobileChatExtension } from "./features/chat";

export const MobileApp = () => {
  return (
    <div 
      className="flex flex-col bg-background overflow-hidden" 
      style={{ 
        height: '100vh',
        minHeight: '100vh',
        maxHeight: '100vh'
      }}
    >
      <MobileSetupApp extensions={[mobileChatExtension]} />
    </div>
  );
};