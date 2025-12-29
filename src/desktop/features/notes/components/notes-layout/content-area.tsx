import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/common/components/ui/resizable";
import { useUIPreferencesStore } from "@/core/stores/ui-preferences.store";
import { ReactNode } from "react";

interface ContentAreaProps {
  children: ReactNode;
  rightSidebar?: ReactNode;
  farRightSidebar?: ReactNode;
  className?: string;
}

export const ContentArea = ({ children, rightSidebar, farRightSidebar, className = "" }: ContentAreaProps) => {
  const { rightSidebarSize, setRightSidebarSize } = useUIPreferencesStore();

  // Calculate content panel size based on right sidebar
  const hasAnyRight = !!rightSidebar || !!farRightSidebar;
  const contentPanelSize = hasAnyRight ? 100 - rightSidebarSize : 100;

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
      {/* Center content area */}
      <ResizablePanel id="content-panel" defaultSize={contentPanelSize} minSize={20}>
        <div className={`h-full flex flex-col bg-background overflow-hidden ${className}`}>
          {children}
        </div>
      </ResizablePanel>

      {/* Right sidebars - render in order: nearest (rightSidebar) then farRightSidebar */}
      {(rightSidebar || farRightSidebar) && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel
            id="right-sidebar-panel"
            defaultSize={rightSidebarSize}
            minSize={20}
            onResize={size => {
              // Update store when user resizes the panel
              setRightSidebarSize(size);
            }}
          >
            <div className="h-full border-l border-border/40 bg-muted overflow-hidden flex">
              {/* Nearest sidebar */}
              {rightSidebar && (
                <div className="h-full flex-1 min-w-0">{rightSidebar}</div>
              )}
              {/* Far right sidebar */}
              {farRightSidebar && (
                <div className={`h-full ${rightSidebar ? 'w-[450px] min-w-[450px] border-l border-border/40' : 'flex-1 min-w-0'}`}>{farRightSidebar}</div>
              )}
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
