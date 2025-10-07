import { FileText, Image, Mic, MoreHorizontal, PanelBottomClose, Phone, Smile, Video, PenLine } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { useInputCollapse } from "../../../hooks/use-input-collapse";
import { getFeaturesConfig } from "@/core/config/features.config";

export function Toolbar() {
    const { inputCollapsed, handleCollapseInput, handleExpandInput } = useInputCollapse();
    const featuresConfig = getFeaturesConfig();

    const leftButtons = [
        { icon: Smile, title: "Emoji", onClick: undefined as (() => void) | undefined, enabled: featuresConfig.channel.input.emoji.enabled },
        { icon: Image, title: "Image", onClick: undefined as (() => void) | undefined, enabled: featuresConfig.channel.input.image.enabled },
        { icon: FileText, title: "File", onClick: undefined as (() => void) | undefined, enabled: featuresConfig.channel.input.file.enabled },
        { icon: Mic, title: "Voice", onClick: undefined as (() => void) | undefined, enabled: featuresConfig.channel.input.voice.enabled },
        { icon: MoreHorizontal, title: "More", onClick: undefined as (() => void) | undefined, enabled: featuresConfig.channel.input.more.enabled },
    ].filter(button => button.enabled);

    const rightButtons = [
        { icon: Phone, title: "Call", onClick: undefined as (() => void) | undefined, enabled: featuresConfig.channel.input.call.enabled },
        { icon: Video, title: "Video", onClick: undefined as (() => void) | undefined, enabled: featuresConfig.channel.input.video.enabled },
    ].filter(button => button.enabled);

    // Add collapse/expand button as the last button
    if (inputCollapsed) {
        rightButtons.push({ icon: PenLine, title: "Show composer", onClick: handleExpandInput, enabled: true });
    } else {
        rightButtons.push({ icon: PanelBottomClose, title: "Hide composer", onClick: handleCollapseInput, enabled: true });
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
