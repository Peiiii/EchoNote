import { Card, CardContent } from "@/common/components/ui/card";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SpaceEmptyStateProps {
  className?: string;
}

export const SpaceEmptyState = ({ className = "" }: SpaceEmptyStateProps) => {
  const { t } = useTranslation();
  return (
    <div className={`flex-1 flex items-center justify-center p-8 ${className}`}>
      <Card className="max-w-md w-full border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-background to-muted/20 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              {t('notes.spaceEmptyState.title')}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t('notes.spaceEmptyState.description')}
            </p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{t('notes.spaceEmptyState.tip1')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>{t('notes.spaceEmptyState.tip2')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t('notes.spaceEmptyState.tip3')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
