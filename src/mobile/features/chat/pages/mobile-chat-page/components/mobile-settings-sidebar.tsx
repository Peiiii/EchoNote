import { Button } from "@/common/components/ui/button";
import { Settings, Info, Code } from "lucide-react";
import { AuthStatus } from "@/common/components/firebase/auth-status";
import { ThemeToggle } from "@/common/components/theme";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";

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

                {/* Developer Section */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Developer
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <Info className="w-4 h-4 mr-2" />
                                Debug Information
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Debug Information</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Version:</span>
                                        <div className="text-muted-foreground">v1.0.1</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Build Time:</span>
                                        <div className="text-muted-foreground">{new Date().toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Environment:</span>
                                        <div className="text-muted-foreground">Production</div>
                                    </div>
                                    <div>
                                        <span className="font-medium">Platform:</span>
                                        <div className="text-muted-foreground">Mobile</div>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground border-t pt-3">
                                    This debug information is only visible to developers and support staff.
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
