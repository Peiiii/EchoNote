import { Button } from "@/common/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/common/hooks/use-language";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="text-xs text-muted-foreground">{t("language.label")}</div>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={language === "en" ? "default" : "outline"}
          className="h-8 px-3"
          onClick={() => setLanguage("en")}
        >
          {t("language.en")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={language === "zh-CN" ? "default" : "outline"}
          className="h-8 px-3"
          onClick={() => setLanguage("zh-CN")}
        >
          {t("language.zhCN")}
        </Button>
      </div>
    </div>
  );
}

