import { Button } from "@/common/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderIconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  titleKey: string;
  ariaLabelKey?: string;
}

export function HeaderIconButton({
  icon: Icon,
  onClick,
  titleKey,
  ariaLabelKey,
}: HeaderIconButtonProps) {
  const { t } = useTranslation();
  const title = t(titleKey);
  const ariaLabel = ariaLabelKey ? t(ariaLabelKey) : title;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

