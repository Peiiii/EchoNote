import { Button } from "@/common/components/ui/button";
import { Settings } from "lucide-react";
import { AuthStatus } from "@/common/components/firebase/auth-status";
import { ThemeToggle } from "@/common/components/theme";

export const MobileSettingsSidebar = () => {
    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-start p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Settings</h3>
                </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-4 space-y-4">
                {/* Account Section */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Account</div>
                    <div className="bg-muted/50 rounded-lg p-3">
                        <AuthStatus />
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Appearance</div>
                    <div className="bg-muted/50 rounded-lg p-3">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Data Section */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Data</div>
                    <Button variant="outline" className="w-full justify-start">
                        Export Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        Import Data
                    </Button>
                </div>
            </div>
        </div>
    );
};
