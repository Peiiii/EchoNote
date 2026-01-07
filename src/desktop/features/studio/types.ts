import { StudioAnyModuleId } from "@/core/stores/studio.store";
import { LucideIcon } from "lucide-react";

export interface StudioModuleConfig {
  id: StudioAnyModuleId;
  title: string;
  description?: string;
  icon: LucideIcon;
  colorClass: string;
  iconColorClass?: string;
  order: number;
  enabled: boolean;
}
