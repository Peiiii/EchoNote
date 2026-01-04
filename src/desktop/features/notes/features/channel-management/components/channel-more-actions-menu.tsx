import { ConfigurableActionMenuContent } from "@/common/components/action-menu";
import { modal } from "@/common/components/modal/modal.store";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { Channel } from "@/core/stores/notes-data.store";
import { MoreVertical, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChannelMoreActionsMenuProps {
  channel: Channel;
}

export function ChannelMoreActionsMenu({ channel }: ChannelMoreActionsMenuProps) {
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
            title={t("common.moreActions")}
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 p-2"
          align="end"
          side="bottom"
          onClick={e => e.stopPropagation()}
        >
          <ConfigurableActionMenuContent
            groups={[
              {
                id: "danger",
                items: [
                  {
                    id: "delete",
                    icon: <Trash2 />,
                    title: t("channelManagement.deleteChannel.title", { channelName: channel.name }),
                    onClick: () =>
                      modal.confirm({
                        title: t("channelManagement.deleteChannel.dialogTitle"),
                        description: t("channelManagement.deleteChannel.description", { channelName: channel.name }),
                        okText: t("common.delete"),
                        okLoadingText: t("channelManagement.deleteChannel.deleting"),
                        okVariant: "destructive",
                        cancelText: t("common.cancel"),
                        onOk: async () => {
                          await presenter.channelManager.deleteChannel(channel.id);
                        },
                      }),
                    variant: "default",
                  },
                ],
              },
            ]}
          />
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
