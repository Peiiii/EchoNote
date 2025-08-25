import { useSetupApp } from "@/core/hooks/use-setup-app";
import type { ExtensionDefinition } from "@cardos/extension";
import { MobilePluginRouter } from "./components/mobile-plugin-router";

export interface MobileSetupAppProps {
    extensions: ExtensionDefinition[]
}

export const MobileSetupApp = (props: MobileSetupAppProps) => {
    const { extensions } = props;
    const { initialized } = useSetupApp({
        extensions,
    });
    
    return !initialized ? (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <div className="text-muted-foreground">Loading...</div>
            </div>
        </div>
    ) : (
        <div 
            className="flex flex-col bg-background overflow-hidden" 
            style={{ 
                height: '100vh',
                minHeight: '100vh',
                maxHeight: '100vh'
            }}
        >
            {/* Main Content Area - Header will be managed by individual pages */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <MobilePluginRouter />
            </div>
        </div>
    );
};
