import { cn } from "@/common/lib/utils";
import { useSetupApp } from "@/core/hooks/use-setup-app";
import type { ExtensionDefinition } from "@cardos/extension";
import { DesktopActivityBar } from "./components/desktop-activity-bar";
import { DesktopPluginRouter } from "./components/desktop-plugin-router";

export interface DesktopSetupAppProps {
    extensions: ExtensionDefinition[]
}

export const DesktopSetupApp = (props: DesktopSetupAppProps) => {
    const { extensions } = props;
    const { initialized } = useSetupApp({
        extensions,
    });
    
    return !initialized ? (
        <div>Loading...</div>
    ) : (
        <div className="fixed inset-0 flex flex-col">
            <div className={cn("flex flex-col h-full")}>
                <div className="flex-1 min-h-0 flex">
                    <DesktopActivityBar className="flex" />
                    <DesktopPluginRouter />
                </div>
            </div>
        </div>
    );
};
