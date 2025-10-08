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

interface MobileCreateChannelPopoverProps {
    onAddChannel: (channel: { name: string; description: string; emoji?: string }) => void;
    trigger?: ReactNode; // Optional custom trigger for different placements (e.g., header icon)
}

export function MobileCreateChannelPopover({ onAddChannel, trigger }: MobileCreateChannelPopoverProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [emoji, setEmoji] = useState<string>(getRandomEmoji());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAddChannel({
            name: name.trim(),
            description: description.trim(),
            emoji: emoji?.trim() || undefined,
        });
        setOpen(false); // Do not reseed here; only reseed on next open
    };

    const handleCancel = () => {
        setName("");
        setDescription("");
        // Do not reseed here; will reseed when dialog opens next time
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (isOpen) {
                    // Reset fields and reseed a new default emoji when opening
                    setName("");
                    setDescription("");
                    setEmoji(getRandomEmoji());
                }
            }}
        >
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button 
                        variant="outline" 
                        className="w-full h-10 text-muted-foreground hover:text-foreground border-dashed"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Space
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Thought Space</DialogTitle>
                    <DialogDescription>
                        Create a new space for organizing your thoughts and conversations.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Emoji selection */}
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
                            placeholder="Enter space name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this space is for"
                            rows={3}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!name.trim()}>
                            Create Space
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
