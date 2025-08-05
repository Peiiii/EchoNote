import { SetupApp } from "@/core/components/setup-app";
import { demoExtension } from "./features/demo";

export const DesktopApp = () => {
    return <div>
        <SetupApp extensions={[demoExtension]} />
    </div>;
};