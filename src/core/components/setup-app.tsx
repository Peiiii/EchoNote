import { useSetupApp } from "@/core/hooks/use-setup-app";
import type { ExtensionDefinition } from "@cardos/extension";
import { PluginRouter } from "./plugin-router";


export interface SetupAppProps {
    extensions: ExtensionDefinition[]
}

export const SetupApp = (props: SetupAppProps) => {
    const { extensions } = props;
    const { initialized } = useSetupApp({
        extensions,
      });
    return initialized ? <PluginRouter /> : null;
};