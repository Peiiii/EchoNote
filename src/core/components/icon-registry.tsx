import { cn } from "@/common/lib/utils";
import { useIcon } from "@/core/stores/icon.store";
import type { LucideIcon } from "lucide-react";

interface IconRegistryProps {
  id?: string;
  className?: string;
  fallbackIcon?: LucideIcon;
}

export function IconRegistry({ id, className, fallbackIcon }: IconRegistryProps) {
  const icon = useIcon(id || "");

  if (icon) {
    // If we found the configured icon, use the configured icon
    const IconComponent = icon;
    return <IconComponent className={cn("w-4 h-4", className)} />;
  }

  if (fallbackIcon) {
    // If a fallback icon is provided, use the fallback
    const FallbackIconComponent = fallbackIcon;
    return <FallbackIconComponent className={cn("w-4 h-4", className)} />;
  }

  // If neither is available, return null
  return null;
}
