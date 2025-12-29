import { ArrowDown, PanelBottomClose, Maximize2 } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";
import { useInputCollapse } from "../../../hooks/use-input-collapse";
import { useComposerStateStore } from "@/core/stores/composer-state.store";
import { useUIStateStore } from "@/core/stores/ui-state.store";

export function HeaderActions() {
  const { sideView } = useUIStateStore();
  const isFocusMode = !sideView;
  const { inputCollapsed, handleCollapseInput, handleExpandInput } = useInputCollapse();
  const setExpanded = useComposerStateStore(s => s.setExpanded);

  return (
    <div className={`flex items-center justify-between px-2 ${isFocusMode ? "pt-1.5 pb-0.5" : "pt-2 pb-1"}`}>
      <div className="flex items-center gap-1.5">
        <ToolbarButton icon={Maximize2} onClick={() => setExpanded(true)} title="Expand composer" />
      </div>
      <div className="flex items-center gap-1.5">
        {inputCollapsed ? (
          <ToolbarButton icon={ArrowDown} onClick={handleExpandInput} title="Show composer" />
        ) : (
          <ToolbarButton icon={PanelBottomClose} onClick={handleCollapseInput} title="Hide composer" />
        )}
      </div>
    </div>
  );
}

