import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateChannelPopoverProps {
    onAddChannel: (channel: { name: string; description: string }) => void;
}

export const CreateChannelPopover = ({ onAddChannel }: CreateChannelPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [newChannelDescription, setNewChannelDescription] = useState("");

    const handleAddChannel = () => {
        if (newChannelName.trim()) {
            onAddChannel({
                name: newChannelName.trim(),
                description: newChannelDescription.trim(),
            });
            setNewChannelName("");
            setNewChannelDescription("");
            setIsOpen(false);
        }
    };

    const handleCancel = () => {
        setNewChannelName("");
        setNewChannelDescription("");
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
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="ghost"
                    className="w-full h-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 border border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Create New Space</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent 
                className="w-80 p-4 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                align="center"
                side="top"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            Create New Thought Space
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Create a dedicated space for your ideas
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                Space Name
                            </label>
                            <Input
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter space name..."
                                className="h-9 mt-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-slate-400 focus:ring-slate-400/20"
                                autoFocus
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                Description (Optional)
                            </label>
                            <Input
                                value={newChannelDescription}
                                onChange={(e) => setNewChannelDescription(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe the theme of this space..."
                                className="h-8 text-sm mt-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-slate-400 focus:ring-slate-400/20"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                        <Button 
                            onClick={handleAddChannel}
                            disabled={!newChannelName.trim()}
                            className="flex-1 h-8 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 hover:bg-slate-700 dark:hover:bg-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-sm">Create</span>
                        </Button>
                        <Button 
                            onClick={handleCancel}
                            variant="outline"
                            className="h-8 px-3 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all duration-200"
                        >
                            <span className="text-sm">Cancel</span>
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
