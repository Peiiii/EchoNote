import { cn } from "@/common/lib/utils";
import { useSetupApp } from "@/core/hooks/use-setup-app";
import type { ExtensionDefinition } from "@cardos/extension";
import { ActivityBarComponent } from "./activity-bar";
import { PluginRouter } from "./plugin-router";


export interface SetupAppProps {
    extensions: ExtensionDefinition[]
}

export const SetupApp = (props: SetupAppProps) => {
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
                    <ActivityBarComponent className="flex" />
                    <PluginRouter />
                </div>
            </div>
        </div>
    );
};