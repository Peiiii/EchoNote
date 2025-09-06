import { Channel } from "@/core/stores/chat-data.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { RefinedPopover } from "@/common/components/refined-popover";
import { EmojiPickerComponent } from "@/common/components/ui/emoji-picker";


interface EditChannelPopoverProps {
  channel: Channel;
  children: React.ReactNode;
}

export const EditChannelPopover = ({ channel, children }: EditChannelPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState(channel.name);
  const [editDescription, setEditDescription] = useState(channel.description);
  const [editEmoji, setEditEmoji] = useState(channel.emoji || "");
  const [isLoading, setIsLoading] = useState(false);
  const { updateChannel } = useChatDataStore();

  const handleSave = async () => {
    if (!editName.trim()) return;
    
    setIsLoading(true);
    try {
      await updateChannel(channel.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        emoji: editEmoji.trim() || undefined
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating channel:", error);
      // Reset to original values on error
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
    if (e.key === 'Enter' && !isLoading) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <RefinedPopover open={isOpen} onOpenChange={setIsOpen}>
      <RefinedPopover.Trigger asChild>
        {children}
      </RefinedPopover.Trigger>
      <RefinedPopover.Content align="end" sideOffset={8}>
        <RefinedPopover.Header>
          <h4 className="text-base font-medium text-slate-900 dark:text-slate-100">
            Edit Channel
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update channel information
          </p>
        </RefinedPopover.Header>
        
        <RefinedPopover.Body>
          <div className="space-y-4">
            {/* Emoji selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Emoji
              </Label>
              <div className="flex items-center gap-2">
                <EmojiPickerComponent
                  value={editEmoji}
                  onSelect={setEditEmoji}
                >
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
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter channel name"
                disabled={isLoading}
                className="h-10 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-200 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400/20 dark:focus:ring-slate-500/20 hover:border-slate-300 dark:hover:border-slate-600"
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
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter channel description"
                disabled={isLoading}
                className="h-10 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-200 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400/20 dark:focus:ring-slate-500/20 hover:border-slate-300 dark:hover:border-slate-600"
              />
            </div>
          </div>
        </RefinedPopover.Body>
        
        <RefinedPopover.Actions>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
            className="h-9 px-4 rounded-md border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 text-slate-700 dark:text-slate-300"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!editName.trim() || isLoading}
            className="h-9 px-4 rounded-md bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </RefinedPopover.Actions>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
};
