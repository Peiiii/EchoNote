import { modal } from "@/common/components/modal/modal.store";
import { LoginCard } from "@/common/features/auth/components/login-card";
import { useAuthStore } from "@/core/stores/auth.store";
import { useEffect } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Button } from "@/common/components/ui/button";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/common/components/language-toggle";

export function LoginModalContent({ allowGuest }: { allowGuest?: boolean }) {
  const currentUser = useAuthStore(s => s.currentUser);
  const initGuestWorkspace = useNotesDataStore(s => s.initGuestWorkspace);
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser) modal.close();
  }, [currentUser]);

  return (
    <div className="space-y-4">
      {allowGuest && (
        <div className="p-3 rounded-lg border border-border bg-muted/30">
          <div className="text-sm font-medium">{t("auth.login.local.hintTitle")}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {t("auth.login.local.hintDesc")}
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              onClick={async () => {
                await initGuestWorkspace({ autoCreateDefaultSpace: true });
                modal.close();
              }}
            >
              {t("auth.login.local.button")}
            </Button>
          </div>
        </div>
      )}
      <LanguageToggle />
      <LoginCard />
    </div>
  );
}
