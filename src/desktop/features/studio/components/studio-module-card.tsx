import { memo } from "react";
import { Card } from "@/common/components/ui/card";
import { StudioModuleConfig } from "../types";
import { cn } from "@/common/lib/utils";
import { motion } from "framer-motion";

interface StudioModuleCardProps {
  module: StudioModuleConfig;
  onClick: () => void;
}

const getIconBgClass = (iconColorClass?: string): string => {
  if (!iconColorClass) {
    return "bg-muted/50 dark:bg-muted/30";
  }

  if (iconColorClass.includes("blue")) {
    return "bg-blue-100/80 dark:bg-blue-900/40";
  }
  if (iconColorClass.includes("purple")) {
    return "bg-purple-100/80 dark:bg-purple-900/40";
  }
  if (iconColorClass.includes("amber") || iconColorClass.includes("orange")) {
    return "bg-amber-100/80 dark:bg-amber-900/40";
  }
  if (iconColorClass.includes("emerald") || iconColorClass.includes("teal")) {
    return "bg-emerald-100/80 dark:bg-emerald-900/40";
  }

  return "bg-muted/50 dark:bg-muted/30";
};

export const StudioModuleCard = memo(function StudioModuleCard({
  module,
  onClick,
}: StudioModuleCardProps) {
  const Icon = module.icon;
  const iconBgClass = getIconBgClass(module.iconColorClass);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <Card
        className={cn(
          "relative overflow-hidden p-0 transition-all duration-300 border group cursor-pointer",
          "backdrop-blur-sm bg-card/80",
          module.colorClass,
          "shadow-sm hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20",
          "hover:border-border/80",
          "before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity before:duration-300",
          "before:bg-gradient-to-br before:from-white/40 before:to-transparent dark:before:from-white/5",
          "hover:before:opacity-100",
          "active:scale-[0.98] active:shadow-sm"
        )}
        onClick={onClick}
      >
        <div className="relative flex items-start">
          <div
            className={cn(
              "flex-shrink-0 w-16 flex items-center justify-center py-3.5 transition-all duration-300",
              "rounded-l-lg",
              iconBgClass
            )}
          >
            <div
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300",
                "shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]",
                "group-hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)]",
                "group-hover:scale-110"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-300 relative z-10",
                  module.iconColorClass || "text-muted-foreground",
                  "group-hover:scale-110",
                  "drop-shadow-sm"
                )}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0 px-4 py-3.5">
            <div
              className={cn(
                "text-sm font-semibold truncate transition-all duration-300",
                "text-foreground group-hover:text-foreground/90 drop-shadow-sm"
              )}
            >
              {module.title}
            </div>
            {module.description && (
              <div className="text-xs truncate mt-1 transition-colors duration-300 text-muted-foreground/70 group-hover:text-muted-foreground/90">
                {module.description}
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 via-white/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
});
