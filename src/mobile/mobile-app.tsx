import { MobileSetupApp } from "./mobile-setup-app";
import { mobileChatExtension } from "./features/notes";

export const MobileApp = () => {
  return (
    <div 
      className="flex flex-col bg-background overflow-hidden" 
      style={{ 
        height: '100%'
      }}
    >
      <MobileSetupApp extensions={[mobileChatExtension]} />
    </div>
  );
};