import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Textarea } from "@/common/components/ui/textarea";
import { Plus } from "lucide-react";
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
    onAddChannel: (channel: { name: string; description: string }) => void;
}

export function MobileCreateChannelPopover({ onAddChannel }: MobileCreateChannelPopoverProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddChannel({
                name: name.trim(),
                description: description.trim(),
            });
            setName("");
            setDescription("");
            setOpen(false);
        }
    };

    const handleCancel = () => {
        setName("");
        setDescription("");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="w-full h-10 text-muted-foreground hover:text-foreground border-dashed"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Space
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Thought Space</DialogTitle>
                    <DialogDescription>
                        Create a new space for organizing your thoughts and conversations.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
