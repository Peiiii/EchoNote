import { AudioLines, Network, BookOpen, FileText } from "lucide-react";
import { StudioModuleConfig } from "../types";
import { StudioModuleId } from "@/core/stores/studio.store";

export const studioModules: StudioModuleConfig[] = [
  {
    id: "audio-summary",
    title: "Audio",
    description: "Generate audio summaries from your notes",
    icon: AudioLines,
    colorClass: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100/60 dark:border-blue-900/40",
    iconColorClass: "text-blue-600 dark:text-blue-400",
    order: 1,
    enabled: true,
  },
  {
    id: "mindmap",
    title: "Mindmap",
    description: "Visualize connections and relationships",
    icon: Network,
    colorClass: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-100/60 dark:border-purple-900/40",
    iconColorClass: "text-purple-600 dark:text-purple-400",
    order: 2,
    enabled: true,
  },
  {
    id: "wiki-card",
    title: "Concept",
    description: "Create wiki-style concept cards",
    icon: BookOpen,
    colorClass: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100/60 dark:border-amber-900/40",
    iconColorClass: "text-amber-600 dark:text-amber-400",
    order: 3,
    enabled: true,
  },
  {
    id: "report",
    title: "Report",
    description: "Generate comprehensive reports",
    icon: FileText,
    colorClass: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-100/60 dark:border-emerald-900/40",
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    order: 4,
    enabled: true,
  },
];

export const getStudioModule = (id: StudioModuleId): StudioModuleConfig | undefined => {
  return studioModules.find((m) => m.id === id);
};

export const getEnabledModules = (): StudioModuleConfig[] => {
  return studioModules.filter((m) => m.enabled).sort((a, b) => a.order - b.order);
};

