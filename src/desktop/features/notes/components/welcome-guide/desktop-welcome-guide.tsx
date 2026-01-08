import { Button } from "@/common/components/ui/button";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { HeaderMenu } from "@/desktop/features/notes/features/message-timeline/components/channel-header/header-menu";

export const DesktopWelcomeGuide = () => {
  const { t } = useTranslation();
  const { addChannel } = useNotesDataStore();

  const handleCreateFirstChannel = async () => {
    try {
      await addChannel({
        name: t("desktop.welcomeGuide.firstSpaceName"),
        emoji: "✨",
        description: t("desktop.welcomeGuide.firstSpaceDescription"),
      });
    } catch (error) {
      console.error("Failed to create first channel:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with menu */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <HeaderMenu tone="dark" />
        <div /> {/* Spacer for balance */}
      </div>

      {/* Empty state content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-sm">
          {/* Simple Icon */}
          <div className="text-6xl">📝</div>

          {/* One-liner */}
          <p className="text-lg text-muted-foreground">
            {t("desktop.welcomeGuide.emptyStateHint")}
          </p>

          {/* Single CTA */}
          <Button
            data-tour="create-first-space"
            onClick={handleCreateFirstChannel}
            size="lg"
            className="px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("desktop.welcomeGuide.createFirstSpace")}
          </Button>
        </div>
      </div>
    </div>
  );
};
