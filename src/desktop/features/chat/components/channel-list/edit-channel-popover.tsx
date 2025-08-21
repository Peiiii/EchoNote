import { Channel } from "@/core/stores/chat-data.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";


interface EditChannelPopoverProps {
  channel: Channel;
  children: React.ReactNode;
}

export const EditChannelPopover = ({ channel, children }: EditChannelPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState(channel.name);
  const [editDescription, setEditDescription] = useState(channel.description);
  const [isLoading, setIsLoading] = useState(false);
  const { updateChannel } = useChatDataStore();

  const handleSave = async () => {
    if (!editName.trim()) return;
    
    setIsLoading(true);
    try {
      await updateChannel(channel.id, {
        name: editName.trim(),
        description: editDescription.trim()
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating channel:", error);
      // Reset to original values on error
      setEditName(channel.name);
      setEditDescription(channel.description);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditName(channel.name);
    setEditDescription(channel.description);
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit Channel</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update channel name and description
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="channel-name">Name</Label>
              <Input
                id="channel-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter channel name"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="channel-description">Description</Label>
              <Input
                id="channel-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter channel description"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!editName.trim() || isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
