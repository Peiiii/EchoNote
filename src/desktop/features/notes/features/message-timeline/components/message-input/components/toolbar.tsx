import { FileText, Image, Mic, MoreHorizontal, PanelBottomClose, Phone, Smile, Video, PenLine } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { useInputCollapse } from "../../../hooks/use-input-collapse";

export function Toolbar() {
    const { inputCollapsed, handleCollapseInput, handleExpandInput } = useInputCollapse();

    const leftButtons = [
        { icon: Smile, title: "Emoji", onClick: undefined as (() => void) | undefined },
        { icon: Image, title: "Image", onClick: undefined as (() => void) | undefined },
        { icon: FileText, title: "File", onClick: undefined as (() => void) | undefined },
        { icon: Mic, title: "Voice", onClick: undefined as (() => void) | undefined },
        { icon: MoreHorizontal, title: "More", onClick: undefined as (() => void) | undefined },
    ];

    const rightButtons = [
        { icon: Phone, title: "Call", onClick: undefined as (() => void) | undefined },
        { icon: Video, title: "Video", onClick: undefined as (() => void) | undefined },
    ];

    // Add collapse/expand button as the last button
    if (inputCollapsed) {
        rightButtons.push({ icon: PenLine, title: "Show composer", onClick: handleExpandInput });
    } else {
        rightButtons.push({ icon: PanelBottomClose, title: "Hide composer", onClick: handleCollapseInput });
    }

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
