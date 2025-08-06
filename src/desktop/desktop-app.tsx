import { SetupApp } from "@/core/components/setup-app";
import { demoExtension } from "./features/demo";
import { chatExtension } from "./features/chat";

export const DesktopApp = () => {
    return (
        <div className="h-screen">
            <SetupApp extensions={[demoExtension, chatExtension]} />
        </div>
    );
};