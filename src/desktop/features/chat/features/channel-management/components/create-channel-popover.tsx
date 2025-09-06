import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { RefinedPopover } from "@/common/components/refined-popover";
import { EmojiPickerComponent } from "@/common/components/ui/emoji-picker";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateChannelPopoverProps {
    onAddChannel: (channel: { name: string; description: string; emoji?: string }) => void;
}

export const CreateChannelPopover = ({ onAddChannel }: CreateChannelPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [newChannelDescription, setNewChannelDescription] = useState("");
    const [newChannelEmoji, setNewChannelEmoji] = useState("");

    const handleAddChannel = () => {
        if (newChannelName.trim()) {
            onAddChannel({
                name: newChannelName.trim(),
                description: newChannelDescription.trim(),
                emoji: newChannelEmoji.trim() || undefined,
            });
            setNewChannelName("");
            setNewChannelDescription("");
            setNewChannelEmoji("");
            setIsOpen(false);
        }
    };

    const handleCancel = () => {
        setNewChannelName("");
        setNewChannelDescription("");
        setNewChannelEmoji("");
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newChannelName.trim()) {
            e.preventDefault();
            handleAddChannel();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    return (
        <RefinedPopover open={isOpen} onOpenChange={setIsOpen}>
            <RefinedPopover.Trigger asChild>
                <Button 
                    variant="ghost"
                    className="w-full h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 border border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Create New Space</span>
                </Button>
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
                    <div className="space-y-4">
                        {/* Emoji selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Emoji
                            </label>
                            <div className="flex items-center gap-2">
                                <EmojiPickerComponent
                                    value={newChannelEmoji}
                                    onSelect={setNewChannelEmoji}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-10 w-16 text-lg border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        {newChannelEmoji || "😊"}
                                    </Button>
                                </EmojiPickerComponent>
                                {newChannelEmoji && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setNewChannelEmoji("")}
                                        className="h-10 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Space Name input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Space Name
                            </label>
                            <Input
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter space name..."
                                className="h-10 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-200 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400/20 dark:focus:ring-slate-500/20 hover:border-slate-300 dark:hover:border-slate-600"
                                autoFocus
                            />
                        </div>
                        
                        {/* Description input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Description (Optional)
                            </label>
                            <Input
                                value={newChannelDescription}
                                onChange={(e) => setNewChannelDescription(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe the theme of this space..."
                                className="h-10 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg transition-colors duration-200 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-400/20 dark:focus:ring-slate-500/20 hover:border-slate-300 dark:hover:border-slate-600"
                            />
                        </div>
                    </div>
                </RefinedPopover.Body>
                
                <RefinedPopover.Actions>
                    <Button 
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 rounded-md border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 text-slate-700 dark:text-slate-300"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAddChannel}
                        disabled={!newChannelName.trim()}
                        size="sm"
                        className="h-9 px-4 rounded-md bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white transition-colors duration-200 disabled:opacity-50"
                    >
                        Create
                    </Button>
                </RefinedPopover.Actions>
            </RefinedPopover.Content>
        </RefinedPopover>
    );
};
