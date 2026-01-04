import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/components/ui/dialog";
import { EmojiPickerComponent } from "@/common/components/ui/emoji-picker";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { ChannelEditField, logService } from "@/core/services/log.service";
import { Channel } from "@/core/stores/notes-data.store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface MobileEditChannelDialogProps {
  channel: Channel;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileEditChannelDialog({
  channel,
  isOpen,
  onOpenChange,
}: MobileEditChannelDialogProps) {
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  const [editName, setEditName] = useState(channel.name);
  const [editDescription, setEditDescription] = useState(channel.description || "");
  const [editEmoji, setEditEmoji] = useState(channel.emoji || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditName(channel.name);
      setEditDescription(channel.description || "");
      setEditEmoji(channel.emoji || "");
    }
  }, [isOpen, channel.id, channel.name, channel.description, channel.emoji]);

  const handleSave = async () => {
    if (!editName.trim()) return;

    setIsLoading(true);
    try {
      const hasNameChanged = editName.trim() !== channel.name;
      const hasDescriptionChanged = editDescription.trim() !== (channel.description || "");
      const hasEmojiChanged = editEmoji.trim() !== (channel.emoji || "");

      await presenter.channelManager.updateChannel(channel.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        emoji: editEmoji.trim() || undefined,
      });

      if (hasNameChanged) {
        logService.logChannelEdit(channel.id, ChannelEditField.NAME);
      }
      if (hasDescriptionChanged) {
        logService.logChannelEdit(channel.id, ChannelEditField.DESCRIPTION);
      }
      if (hasEmojiChanged) {
        logService.logChannelEdit(channel.id, ChannelEditField.EMOJI);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating channel:", error);
      setEditName(channel.name);
      setEditDescription(channel.description || "");
      setEditEmoji(channel.emoji || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditName(channel.name);
    setEditDescription(channel.description || "");
    setEditEmoji(channel.emoji || "");
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("channelManagement.editChannel.title")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Emoji */}
          <div className="space-y-2">
            <Label htmlFor="emoji">{t("channelManagement.editChannel.emoji")}</Label>
            <div className="flex items-center gap-2">
              <EmojiPickerComponent onSelect={setEditEmoji}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  type="button"
                >
                  {editEmoji || "😊"}
                </Button>
              </EmojiPickerComponent>
              <Input
                id="emoji"
                value={editEmoji}
                onChange={(e) => setEditEmoji(e.target.value)}
                placeholder={t("channelManagement.editChannel.emojiPlaceholder")}
                className="flex-1"
                maxLength={2}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("channelManagement.editChannel.name")}</Label>
            <Input
              id="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder={t("channelManagement.editChannel.namePlaceholder")}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t("channelManagement.editChannel.description")}</Label>
            <Textarea
              id="description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder={t("channelManagement.editChannel.descriptionPlaceholder")}
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !editName.trim()}
          >
            {isLoading ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
