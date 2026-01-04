import { DropdownMenuSubTrigger } from "@/common/components/ui/dropdown-menu";
import { cn } from "@/common/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode, isValidElement } from "react";

interface HeaderMenuSubTriggerProps {
  icon: LucideIcon | ReactNode;
  children: ReactNode;
  className?: string;
}

export function HeaderMenuSubTrigger({
  icon: Icon,
  children,
  className,
}: HeaderMenuSubTriggerProps) {
  let iconElement: ReactNode;
  
  if (isValidElement(Icon)) {
    iconElement = Icon;
  } else if (Icon && (typeof Icon === "function" || (Icon as any)?.$$typeof)) {
    const IconComponent = Icon as LucideIcon;
    iconElement = <IconComponent className="h-4 w-4" />;
  } else {
    iconElement = null;
  }

  return (
    <DropdownMenuSubTrigger className={cn("cursor-pointer rounded-md gap-2", className)}>
      {iconElement}
      <span>{children}</span>
    </DropdownMenuSubTrigger>
  );
}

