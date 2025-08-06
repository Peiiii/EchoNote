import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { useChatStore } from "@/core/stores/chat-store";
import { BookOpen, Briefcase, GraduationCap, Plus, Sparkles, Lightbulb, Heart, Zap, Target, Users } from "lucide-react";
import { useState } from "react";

const channelIcons = {
    general: Sparkles,
    work: Briefcase,
    study: GraduationCap,
    ideas: Lightbulb,
    personal: Heart,
    goals: Target,
    team: Users,
    default: BookOpen,
};

export const ChannelList = () => {
    const { channels, currentChannelId, setCurrentChannel, addChannel } = useChatStore();
    const [newChannelName, setNewChannelName] = useState("");
    const [newChannelDescription, setNewChannelDescription] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddChannel = () => {
        if (newChannelName.trim()) {
            addChannel({
                name: newChannelName.trim(),
                description: newChannelDescription.trim(),
            });
            setNewChannelName("");
            setNewChannelDescription("");
            setIsDialogOpen(false);
        }
    };

    const getChannelIcon = (channelId: string) => {
        const IconComponent = channelIcons[channelId as keyof typeof channelIcons] || channelIcons.default;
        return <IconComponent className="w-4 h-4" />;
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                    Thought Spaces
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Choose your thinking domain
                </p>
            </div>
            
            {/* Channel List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {channels.map((channel) => {
                    const isActive = currentChannelId === channel.id;
                    
                    return (
                        <button
                            key={channel.id}
                            onClick={() => setCurrentChannel(channel.id)}
                            className={`w-full group transition-all duration-200 ${
                                isActive 
                                    ? 'transform scale-[1.02]' 
                                    : 'hover:transform hover:scale-[1.01]'
                            }`}
                        >
                            <div className={`relative p-4 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm'
                                    : 'bg-transparent hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                            }`}>
                                
                                <div className="flex items-start gap-3">
                                    {/* Channel Icon */}
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                        isActive
                                            ? 'bg-slate-100 dark:bg-slate-600'
                                            : 'bg-slate-100 dark:bg-slate-800'
                                    }`}>
                                        {getChannelIcon(channel.id)}
                                    </div>
                                    
                                    {/* Channel Info */}
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-medium ${
                                                isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {channel.name}
                                            </span>
                                            {channel.messageCount > 0 && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    isActive 
                                                        ? 'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300' 
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                    {channel.messageCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs line-clamp-2 ${
                                            isActive ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'
                                        }`}>
                                            {channel.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            
            {/* Add Channel Button */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200" 
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Space
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-medium">Create New Thought Space</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Space Name</label>
                                <Input
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value)}
                                    placeholder="Enter space name"
                                    className="mt-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Space Description</label>
                                <Input
                                    value={newChannelDescription}
                                    onChange={(e) => setNewChannelDescription(e.target.value)}
                                    placeholder="Describe the theme of this space (optional)"
                                    className="mt-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                />
                            </div>
                            <Button 
                                onClick={handleAddChannel} 
                                className="w-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 hover:bg-slate-700 dark:hover:bg-slate-300"
                            >
                                Create Space
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}; 