import { memo } from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface StudioEmptyStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const StudioEmptyState = memo(function StudioEmptyState({
  title,
  description,
  children,
}: StudioEmptyStateProps) {
  const { t } = useTranslation();
  const displayTitle = title ?? t("studio.emptyState.title");
  const displayDescription = description ?? t("studio.emptyState.description");
  return (
    <div className="text-center py-12 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border border-primary/10 shadow-sm mb-4"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-6 h-6 text-primary/80 drop-shadow-sm" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-sm font-semibold mb-2 text-foreground/90"
      >
        {displayTitle}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="text-sm text-muted-foreground/80 leading-relaxed max-w-sm mx-auto mb-4"
      >
        {displayDescription}
      </motion.div>
      {children}
    </div>
  );
});

