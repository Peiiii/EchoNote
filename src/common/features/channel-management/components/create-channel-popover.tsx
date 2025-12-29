import { RefinedPopover } from "@/common/components/refined-popover";
import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";
import { EmojiPickerComponent } from "@/common/components/ui/emoji-picker";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { getRandomEmoji } from "@/common/utils/emoji";
import { logService } from "@/core/services/log.service";
import { Plus } from "lucide-react";
import React, { useState, type ReactNode, isValidElement, cloneElement } from "react";

interface CreateChannelPopoverProps {
  trigger?: ReactNode;
  variant?: "dialog" | "popover";
  /** When true, clicking trigger will instantly create a space with a default name */
  instantCreate?: boolean;
  /** Optional default name when instant creating (defaults to 'Untitled') */
  defaultName?: string;
}

export function CreateChannelPopover({
  trigger,
  variant = "popover",
  instantCreate = false,
  defaultName = "Untitled",
}: CreateChannelPopoverProps) {
  const presenter = useCommonPresenterContext();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState<string>(getRandomEmoji());

  const handleAddChannel = async (channel: { name: string; description: string; emoji?: string }) => {
    await presenter.channelManager.addChannel(channel);
    logService.logChannelCreate(
      channel.name,
      channel.name,
      !!channel.description
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    handleAddChannel({
      name: name.trim(),
      description: description.trim(),
      emoji: emoji?.trim() || undefined,
    });
    setOpen(false);
  };

  // Instant create flow: create a space immediately without asking for inputs
  const handleInstantCreate = async () => {
    await handleAddChannel({
      name: defaultName,
      description: "",
      emoji: undefined,
    });
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const resetAndOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setName("");
      setDescription("");
      setEmoji(getRandomEmoji());
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      className="w-full h-10 text-muted-foreground hover:text-foreground border-dashed"
      onClick={instantCreate ? handleInstantCreate : undefined}
    >
      <Plus className="w-4 h-4 mr-2" />
      New Space
    </Button>
  );

  const formContent = (
    <div className="space-y-4 pb-2">
      <div className="space-y-2">
        <Label htmlFor="emoji">Emoji</Label>
        <div className="flex items-center gap-2">
          <EmojiPickerComponent onSelect={setEmoji}>
            <Button type="button" variant="outline" size="sm" className="h-10 w-16 text-sm">
              {emoji || "Select"}
            </Button>
          </EmojiPickerComponent>
          {emoji && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEmoji("")}
              className="h-10 px-2 text-muted-foreground"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter space name"
          required
          autoFocus={variant === "popover"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        {variant === "dialog" ? (
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what this space is for"
            rows={3}
          />
        ) : (
          <Input
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the theme of this space..."
          />
        )}
      </div>
    </div>
  );

  const actions = (
    <>
      <RefinedPopover.Button type="button" variant="outline" onClick={handleCancel}>
        Cancel
      </RefinedPopover.Button>
      <RefinedPopover.Button
        type="submit"
        variant="default"
        disabled={!name.trim()}
        onClick={handleSubmit}
      >
        Create Space
      </RefinedPopover.Button>
    </>
  );

  // If instant create is enabled, we don't render any popover/dialog at all,
  // just return the trigger with the instant create handler attached.
  if (instantCreate) {
    // Attach click handler to custom trigger if provided
    if (trigger) {
      if (isValidElement<{ onClick?: (e: React.MouseEvent) => void }>(trigger)) {
        const existing = trigger.props.onClick;
        const mergedOnClick = async (e: React.MouseEvent) => {
          existing?.(e);
          await handleInstantCreate();
        };
        return cloneElement(trigger, { onClick: mergedOnClick } as Partial<typeof trigger.props>);
      }
      return <span onClick={handleInstantCreate}>{trigger}</span>;
    }
    return defaultTrigger;
  }

  if (variant === "dialog") {
    return (
      <Dialog open={open} onOpenChange={resetAndOpen}>
        <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Thought Space</DialogTitle>
            <DialogDescription>
              Create a new space for organizing your thoughts and conversations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {formContent}
            <DialogFooter className="gap-2 pt-4">{actions}</DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <RefinedPopover open={open} onOpenChange={resetAndOpen}>
      <RefinedPopover.Trigger asChild>{trigger ?? defaultTrigger}</RefinedPopover.Trigger>
      <RefinedPopover.Content align="center" side="bottom">
        <RefinedPopover.Header>
          <Plus className="w-4 h-4 text-primary/80" />
          <div className="text-sm font-semibold text-foreground/90">Create New Thought Space</div>
        </RefinedPopover.Header>

        <RefinedPopover.Body>{formContent}</RefinedPopover.Body>

        <RefinedPopover.Actions>{actions}</RefinedPopover.Actions>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
}
