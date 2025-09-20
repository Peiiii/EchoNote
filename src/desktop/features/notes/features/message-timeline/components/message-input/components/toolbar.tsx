import { FileText, Image, Mic, MoreHorizontal, Phone, Smile, Video } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";

export function Toolbar() {

    const leftButtons = [
        { icon: Smile, title: "Emoji", onClick: undefined },
        { icon: Image, title: "Image", onClick: undefined },
        { icon: FileText, title: "File", onClick: undefined },
        { icon: Mic, title: "Voice", onClick: undefined },
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
