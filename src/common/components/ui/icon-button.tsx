import { Button } from "@/common/components/ui/button";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  ariaLabel?: string;
}

export function IconButton({
  icon: Icon,
  onClick,
  title,
  ariaLabel,
}: IconButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel ?? title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

