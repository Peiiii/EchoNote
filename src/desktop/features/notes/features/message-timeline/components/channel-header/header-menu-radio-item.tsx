import { DropdownMenuRadioItem } from "@/common/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HeaderMenuRadioItemProps {
  icon?: LucideIcon;
  value: string;
  children: ReactNode;
  className?: string;
}

export function HeaderMenuRadioItem({
  icon: Icon,
  value,
  children,
  className,
}: HeaderMenuRadioItemProps) {
  return (
    <DropdownMenuRadioItem value={value} className={className}>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </DropdownMenuRadioItem>
  );
}

