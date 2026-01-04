import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { logService } from "@/core/services/log.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ChannelListEmptyState = () => {
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  const userId = useNotesDataStore(s => s.userId);

  const handleAddChannel = async (channel: { name: string; description: string; emoji?: string }) => {
    if (!userId) {
      openLoginModal({
        title: t('auth.login.titleOrLocal'),
        description: t('auth.login.descOrLocal'),
        allowGuest: true,
      });
      return;
    }
    await presenter.channelManager.addChannel(channel);
    logService.logChannelCreate(
      channel.name,
      channel.name,
      !!channel.description
    );
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{t('channelManagement.channelListEmptyState.title')}</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-xs">
        {t('channelManagement.channelListEmptyState.description')}
      </p>
      <button
        onClick={() =>
          handleAddChannel({
            name: t('desktop.welcomeGuide.firstSpaceName'),
            emoji: "🚀",
            description: t('desktop.welcomeGuide.firstSpaceDescription'),
          })
        }
        className="text-sm text-primary hover:text-primary/80 font-medium"
      >
        {t('channelManagement.channelListEmptyState.createFirstSpace')}
      </button>
    </div>
  );
};
