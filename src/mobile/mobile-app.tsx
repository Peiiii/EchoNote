import { MobileSetupApp } from "./mobile-setup-app";
import { mobileNotesExtension } from "./features/notes";
import { ModalRenderer } from "@/common/lib/imperative-modal";

export const MobileApp = () => {
  return (
    <div
      className="flex flex-col bg-background overflow-hidden"
      style={{
        height: "100%",
      }}
    >
      <MobileSetupApp extensions={[mobileNotesExtension]} />
      <ModalRenderer />
    </div>
  );
};
