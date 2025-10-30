import { ArrowDown, ArrowUp, FileText, Image, Mic, MoreHorizontal, PanelBottomClose, Maximize2 } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { getFeaturesConfig } from "@/core/config/features.config";
import { useInputCollapse } from "../../../hooks/use-input-collapse";
import { useComposerStateStore } from "@/core/stores/composer-state.store";

interface BottomActionsProps {
  onSend: () => void;
  canSend: boolean;
}

export function BottomActions({ onSend, canSend }: BottomActionsProps) {
  const { inputCollapsed, handleCollapseInput, handleExpandInput } = useInputCollapse();
  const setExpanded = useComposerStateStore(s => s.setExpanded);

  const leftButtons: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    onClick?: () => void;
    enabled: boolean;
  }> = [
    { icon: Image, title: "Image", onClick: undefined, enabled: getFeaturesConfig().channel.input.image.enabled },
    { icon: FileText, title: "File", onClick: undefined, enabled: getFeaturesConfig().channel.input.file.enabled },
    { icon: Mic, title: "Voice", onClick: undefined, enabled: getFeaturesConfig().channel.input.voice.enabled },
    { icon: MoreHorizontal, title: "More", onClick: undefined, enabled: getFeaturesConfig().channel.input.more.enabled },
  ].filter(b => b.enabled);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {leftButtons.map((b, i) => (
          <ToolbarButton key={i} icon={b.icon} onClick={b.onClick} title={b.title} />
        ))}
        {/* Expand composer to occupy the timeline content area */}
        <ToolbarButton icon={Maximize2} onClick={() => setExpanded(true)} title="Expand composer" />
        {inputCollapsed ? (
          <ToolbarButton icon={ArrowDown} onClick={handleExpandInput} title="Show composer" />
        ) : (
          <ToolbarButton icon={PanelBottomClose} onClick={handleCollapseInput} title="Hide composer" />
        )}
      </div>
      <div className="flex items-center">
        <button
          onClick={onSend}
          disabled={!canSend}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-150 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 ${
            !canSend ? "opacity-40 cursor-not-allowed hover:bg-transparent" : ""
          }`}
          aria-label="Send note"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
