import { Button } from "@/common/components/ui/button";
import { useTranslation } from "react-i18next";

type AppLanguage = "en" | "zh-CN";

const normalize = (lng: string): AppLanguage => (lng.toLowerCase().startsWith("zh") ? "zh-CN" : "en");

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const active = normalize(i18n.resolvedLanguage ?? i18n.language);

  const handleLanguageChange = async (language: AppLanguage) => {
    await i18n.changeLanguage(language);
    window.location.reload();
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="text-xs text-muted-foreground">{t("language.label")}</div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={active === "en" ? "default" : "outline"}
          className="h-8 px-3"
          onClick={() => handleLanguageChange("en")}
        >
          {t("language.en")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={active === "zh-CN" ? "default" : "outline"}
          className="h-8 px-3"
          onClick={() => handleLanguageChange("zh-CN")}
        >
          {t("language.zhCN")}
        </Button>
      </div>
    </div>
  );
}

