import { Button } from "@/common/components/ui/button";
import { Plus, Hash } from "lucide-react";
import { useChatStore } from "@/core/stores/chat-store";
import { useState } from "react";
import { Input } from "@/common/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";

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

    return (
        <div className="flex flex-col h-full">
            {/* 标题 */}
            <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">频道</h3>
            </div>
            
            {/* 频道列表 */}
            <div className="flex-1 overflow-y-auto">
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        onClick={() => setCurrentChannel(channel.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors ${
                            currentChannelId === channel.id ? "bg-accent" : ""
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{channel.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                            {channel.description}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">
                            {channel.messageCount} 条消息
                        </div>
                    </button>
                ))}
            </div>
            
            {/* 添加频道按钮 */}
            <div className="p-4 border-t">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            新建频道
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>创建新频道</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">频道名称</label>
                                <Input
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value)}
                                    placeholder="输入频道名称"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">频道描述</label>
                                <Input
                                    value={newChannelDescription}
                                    onChange={(e) => setNewChannelDescription(e.target.value)}
                                    placeholder="输入频道描述（可选）"
                                    className="mt-1"
                                />
                            </div>
                            <Button onClick={handleAddChannel} className="w-full">
                                创建频道
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}; 