import { Bot, FileText, Image, Mic, MoreHorizontal, Phone, Smile, Video } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";

interface ToolbarProps {
    currentChannelId: string | null;
}

export function Toolbar({ currentChannelId }: ToolbarProps) {
    const handleOpenAIAssistant = () => {
        if (currentChannelId) {
            rxEventBusService.requestOpenAIAssistant$.emit({ channelId: currentChannelId });
        }
    };

    const leftButtons = [
        { icon: Smile, title: "Emoji", onClick: undefined },
        { icon: Image, title: "Image", onClick: undefined },
        { icon: FileText, title: "File", onClick: undefined },
        { icon: Mic, title: "Voice", onClick: undefined },
        { icon: Bot, title: "AI Assistant", onClick: handleOpenAIAssistant },
        { icon: MoreHorizontal, title: "More", onClick: undefined },
    ];

    const rightButtons = [
        { icon: Phone, title: "Call", onClick: undefined },
        { icon: Video, title: "Video", onClick: undefined },
    ];

    return (
        <div className="px-4 py-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
                {leftButtons.map((button, index) => (
                    <ToolbarButton
                        key={index}
                        icon={button.icon}
                        onClick={button.onClick}
                        title={button.title}
                    />
                ))}
            </div>

            <div className="flex items-center gap-1">
                {rightButtons.map((button, index) => (
                    <ToolbarButton
                        key={index}
                        icon={button.icon}
                        onClick={button.onClick}
                        title={button.title}
                    />
                ))}
            </div>
        </div>
    );
}
