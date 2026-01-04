import { Button } from "@/common/components/ui/button";
import { Settings, Info, Code, X } from "lucide-react";
import { AuthStatus } from "@/common/components/firebase/auth-status";
import { ThemeToggle } from "@/common/components/theme";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface MobileSettingsSidebarProps {
  onClose?: () => void;
}

export const MobileSettingsSidebar = ({ onClose }: MobileSettingsSidebarProps) => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{t('mobile.settings.title')}</h3>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('common.close')}
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Account Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">{t("mobile.settings.account")}</div>
          <div className="bg-muted/50 rounded-lg p-3">
            <AuthStatus />
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">{t("mobile.settings.appearance")}</div>
          <div className="bg-muted/50 rounded-lg p-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Data Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground">{t("mobile.settings.data")}</div>
          <Button variant="outline" className="w-full justify-start">
            {t("mobile.settings.exportData")}
          </Button>
          <Button variant="outline" className="w-full justify-start">
            {t("mobile.settings.importData")}
          </Button>
        </div>

        {/* Developer Section */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-foreground flex items-center gap-2">
            <Code className="w-4 h-4" />
            {t("mobile.settings.developer")}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Info className="w-4 h-4 mr-2" />
                {t("mobile.settings.debugInformation")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("mobile.settings.debugInformation")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t("mobile.settings.version")}:</span>
                    <div className="text-muted-foreground">v1.0.5</div>
                  </div>
                  <div>
                    <span className="font-medium">{t("mobile.settings.buildTime")}:</span>
                    <div className="text-muted-foreground">{new Date().toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">{t("mobile.settings.environment")}:</span>
                    <div className="text-muted-foreground">{t("mobile.settings.production")}</div>
                  </div>
                  <div>
                    <span className="font-medium">{t("mobile.settings.platform")}:</span>
                    <div className="text-muted-foreground">{t("mobile.settings.mobile")}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground border-t pt-3">
                  {t("mobile.settings.debugInfoNote")}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
