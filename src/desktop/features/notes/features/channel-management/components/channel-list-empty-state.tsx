import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { logService } from "@/core/services/log.service";
import { Plus } from "lucide-react";

export const ChannelListEmptyState = () => {
  const presenter = useCommonPresenterContext();

  const handleAddChannel = async (channel: { name: string; description: string; emoji?: string }) => {
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
      <h3 className="text-lg font-semibold text-foreground mb-2">No spaces yet</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-xs">
        Create your first thought space to start organizing your ideas and thoughts.
      </p>
      <button
        onClick={() =>
          handleAddChannel({
            name: "My First Space",
            emoji: "🚀",
            description: "Start your journey here",
          })
        }
        className="text-sm text-primary hover:text-primary/80 font-medium"
      >
        Create your first space
      </button>
    </div>
  );
};
