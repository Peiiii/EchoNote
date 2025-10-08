import { useState, type ReactNode } from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";
import { Plus } from "lucide-react";
import { EmojiPickerComponent } from "@/common/components/ui/emoji-picker";
import { getRandomEmoji } from "@/common/utils/emoji";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/common/components/ui/dialog";
import { RefinedPopover } from "@/common/components/refined-popover";

interface CreateChannelPopoverProps {
    onAddChannel: (channel: { name: string; description: string; emoji?: string }) => void;
    trigger?: ReactNode;
    variant?: 'dialog' | 'popover';
}

export function CreateChannelPopover({ onAddChannel, trigger, variant = 'popover' }: CreateChannelPopoverProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [emoji, setEmoji] = useState<string>(getRandomEmoji());

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!name.trim()) return;
        onAddChannel({
            name: name.trim(),
            description: description.trim(),
            emoji: emoji?.trim() || undefined,
        });
        setOpen(false);
    };

    const handleCancel = () => {
        setName("");
        setDescription("");
        setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && name.trim()) {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
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
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-10 w-16 text-sm"
                        >
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
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter space name"
                    required
                    autoFocus={variant === 'popover'}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                {variant === 'dialog' ? (
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what this space is for"
                        rows={3}
                    />
                ) : (
                    <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe the theme of this space..."
                    />
                )}
            </div>
        </div>
    );

    const actions = (
        <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()} onClick={handleSubmit}>
                Create Space
            </Button>
        </div>
    );

    if (variant === 'dialog') {
        return (
            <Dialog open={open} onOpenChange={resetAndOpen}>
                <DialogTrigger asChild>
                    {trigger ?? defaultTrigger}
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Thought Space</DialogTitle>
                        <DialogDescription>
                            Create a new space for organizing your thoughts and conversations.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        {formContent}
                        <DialogFooter className="gap-2 pt-4">
                            {actions}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <RefinedPopover open={open} onOpenChange={resetAndOpen}>
            <RefinedPopover.Trigger asChild>
                {trigger ?? defaultTrigger}
            </RefinedPopover.Trigger>
            <RefinedPopover.Content align="center" side="top">
                <RefinedPopover.Header>
                    <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                        Create New Thought Space
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Create a dedicated space for your ideas
                    </p>
                </RefinedPopover.Header>
                
                <RefinedPopover.Body>
                    {formContent}
                </RefinedPopover.Body>
                
                <RefinedPopover.Actions className="pt-4">
                    {actions}
                </RefinedPopover.Actions>
            </RefinedPopover.Content>
        </RefinedPopover>
    );
}
