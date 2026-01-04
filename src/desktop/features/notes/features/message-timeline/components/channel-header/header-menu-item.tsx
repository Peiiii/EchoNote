import { DropdownMenuItem } from "@/common/components/ui/dropdown-menu";
import { cn } from "@/common/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface HeaderMenuItemProps {
  icon: LucideIcon;
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
}

export function HeaderMenuItem({
  icon: Icon,
  children,
  onSelect,
  disabled,
  className,
}: HeaderMenuItemProps) {
  return (
    <DropdownMenuItem
      className={cn("cursor-pointer rounded-md", className)}
      disabled={disabled}
      onSelect={onSelect}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </DropdownMenuItem>
  );
}

