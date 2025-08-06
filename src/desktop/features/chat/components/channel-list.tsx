import { Button } from "@/common/components/ui/button";
import { Plus, Hash, Sparkles, BookOpen, Briefcase, GraduationCap, Heart, Star } from "lucide-react";
import { useChatStore } from "@/core/stores/chat-store";
import { useState } from "react";
import { Input } from "@/common/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";

const channelIcons = {
    general: Sparkles,
    work: Briefcase,
    study: GraduationCap,
    default: BookOpen,
};

const channelColors = {
    general: "from-blue-500 to-purple-600",
    work: "from-orange-500 to-red-600",
    study: "from-green-500 to-teal-600",
    default: "from-slate-500 to-gray-600",
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

    const getChannelColor = (channelId: string) => {
        return channelColors[channelId as keyof typeof channelColors] || channelColors.default;
    };

    return (
        <div className="flex flex-col h-full">
            {/* 标题 */}
            <div className="p-6 border-b border-white/20">
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
                    思想空间
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    选择你的思考领域
                </p>
            </div>
            
            {/* 频道列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {channels.map((channel) => {
                    const isActive = currentChannelId === channel.id;
                    const colorClass = getChannelColor(channel.id);
                    
                    return (
                        <button
                            key={channel.id}
                            onClick={() => setCurrentChannel(channel.id)}
                            className={`w-full group transition-all duration-300 ${
                                isActive 
                                    ? 'transform scale-105' 
                                    : 'hover:transform hover:scale-102'
                            }`}
                        >
                            <div className={`relative p-4 rounded-xl transition-all duration-300 ${
                                isActive
                                    ? `bg-gradient-to-br ${colorClass} text-white shadow-lg`
                                    : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-white/50 dark:border-slate-700/50'
                            }`}>
                                
                                {/* 活跃状态指示器 */}
                                {isActive && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                                )}
                                
                                <div className="flex items-start gap-3">
                                    {/* 频道图标 */}
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        isActive
                                            ? 'bg-white/20'
                                            : `bg-gradient-to-br ${colorClass} text-white`
                                    }`}>
                                        {getChannelIcon(channel.id)}
                                    </div>
                                    
                                    {/* 频道信息 */}
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-semibold ${
                                                isActive ? 'text-white' : 'text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {channel.name}
                                            </span>
                                            {channel.messageCount > 0 && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    isActive 
                                                        ? 'bg-white/20 text-white' 
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                }`}>
                                                    {channel.messageCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs line-clamp-2 ${
                                            isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
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
            
            {/* 添加频道按钮 */}
            <div className="p-4 border-t border-white/20">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-full bg-white/80 dark:bg-slate-800/80 border-white/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300" 
                            size="sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            新建空间
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-white/50 dark:border-slate-700/50">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">创建新的思想空间</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">空间名称</label>
                                <Input
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value)}
                                    placeholder="输入空间名称"
                                    className="mt-1 bg-white/80 dark:bg-slate-800/80 border-white/50 dark:border-slate-700/50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">空间描述</label>
                                <Input
                                    value={newChannelDescription}
                                    onChange={(e) => setNewChannelDescription(e.target.value)}
                                    placeholder="描述这个空间的主题（可选）"
                                    className="mt-1 bg-white/80 dark:bg-slate-800/80 border-white/50 dark:border-slate-700/50"
                                />
                            </div>
                            <Button 
                                onClick={handleAddChannel} 
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                创建空间
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}; 