import { AuthStatus } from "@/common/components/firebase/auth-status";
import { ThemeToggle } from "@/common/components/theme";
import { Button } from "@/common/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/common/components/ui/tabs";
import { ApiAccessPanel } from "@/common/features/api-access/components/api-access-panel";
import { useSettingsViewStore } from "@/core/stores/settings-view.store";
import { Settings, KeyRound, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export function DesktopSettingsSidebar({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const activeTab = useSettingsViewStore(s => s.activeTab);
  const setActiveTab = useSettingsViewStore(s => s.setActiveTab);

  return (
    <div className="h-full flex flex-col bg-background border-l border-border/60">
      <div className="flex items-center justify-between p-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">{t("settings.title")}</h3>
        </div>
        <Button variant="ghost" size="icon" aria-label={t("common.close")} className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as never)} className="flex-1 min-h-0">
        <div className="p-4 border-b border-border/60">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">
              {t("settings.tabs.general")}
            </TabsTrigger>
            <TabsTrigger value="apiAccess" className="flex-1">
              <KeyRound className="w-4 h-4" />
              {t("settings.tabs.apiAccess")}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <TabsContent value="general">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">{t("settings.sections.account")}</div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <AuthStatus />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">{t("settings.sections.appearance")}</div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apiAccess">
            <ApiAccessPanel />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
