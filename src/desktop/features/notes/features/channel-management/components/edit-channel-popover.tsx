import { RefinedPopover } from "@/common/components/refined-popover";
import { Button } from "@/common/components/ui/button";
import { EmojiPickerComponent } from "@/common/components/ui/emoji-picker";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { ChannelEditField, logService } from "@/core/services/log.service";
import { Channel } from "@/core/stores/notes-data.store";
import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditChannelPopoverProps {
  channel: Channel;
  children: React.ReactNode;
}

export const EditChannelPopover = ({ channel, children }: EditChannelPopoverProps) => {
  const presenter = useCommonPresenterContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState(channel.name);
  const [editDescription, setEditDescription] = useState(channel.description);
  const [editEmoji, setEditEmoji] = useState(channel.emoji || "");
  const [isLoading, setIsLoading] = useState(false);

  // Sync form state with latest channel when popover opens or when channel switches while open.
  // This fixes stale data when user switches space via dropdown and then clicks edit.
  useEffect(() => {
    if (!isOpen) return;
    setEditName(channel.name);
    setEditDescription(channel.description);
    setEditEmoji(channel.emoji || "");
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

      setIsOpen(false);
    } catch (error) {
      console.error("Error updating channel:", error);
      setEditName(channel.name);
      setEditDescription(channel.description);
      setEditEmoji(channel.emoji || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditName(channel.name);
    setEditDescription(channel.description);
    setEditEmoji(channel.emoji || "");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <RefinedPopover open={isOpen} onOpenChange={setIsOpen}>
      <RefinedPopover.Trigger asChild>{children}</RefinedPopover.Trigger>
      <RefinedPopover.Content align="center" side="bottom">
        <RefinedPopover.Header>
          <Edit3 className="w-4 h-4 text-primary/80" />
          <div className="text-sm font-semibold text-foreground/90">Edit Thought Space</div>
        </RefinedPopover.Header>

        <RefinedPopover.Body>
          <div className="space-y-4">
            {/* Emoji selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Emoji
              </Label>
              <div className="flex items-center gap-2">
                <EmojiPickerComponent value={editEmoji} onSelect={setEditEmoji}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-16 text-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {editEmoji || "😊"}
                  </Button>
                </EmojiPickerComponent>
                {editEmoji && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditEmoji("")}
                    className="h-10 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Name input */}
            <div className="space-y-2">
              <Label
                htmlFor="channel-name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Channel Name
              </Label>
              <Input
                id="channel-name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter channel name"
                disabled={isLoading}
                className="h-10 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-200 focus:border-slate-400 dark:focus:border-slate-500  hover:border-slate-300 dark:hover:border-slate-600"
              />
            </div>

            {/* Description input */}
            <div className="space-y-2">
              <Label
                htmlFor="channel-description"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Description
              </Label>
              <Input
                id="channel-description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter channel description"
                disabled={isLoading}
                className="h-10 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-200 focus:border-slate-400 dark:focus:border-slate-500  hover:border-slate-300 dark:hover:border-slate-600"
              />
            </div>
          </div>
        </RefinedPopover.Body>

        <RefinedPopover.Actions>
          <RefinedPopover.Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </RefinedPopover.Button>
          <RefinedPopover.Button
            type="button"
            variant="default"
            onClick={handleSave}
            disabled={!editName.trim() || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </RefinedPopover.Button>
        </RefinedPopover.Actions>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
};
