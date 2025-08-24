import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/common/components/ui/resizable";
import { useViewStateStore } from "@/core/stores/view-state.store";
import { ReactNode } from "react";

interface ContentAreaProps {
    children: ReactNode;
    rightSidebar?: ReactNode;
    className?: string;
}

export const ContentArea = ({ children, rightSidebar, className = "" }: ContentAreaProps) => {
    const { 
        rightSidebarSize, 
        setRightSidebarSize 
    } = useViewStateStore();

    // Only update store when rightSidebar prop changes
    // Don't sync visibility state to avoid conflicts with user preferences

    // Calculate content panel size based on right sidebar
    const contentPanelSize = rightSidebar ? (100 - rightSidebarSize) : 100;

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 min-h-0"
            key={rightSidebar ? 'with-sidebar' : 'without-sidebar'}
        >
            {/* Center content area */}
            <ResizablePanel
                id="content-panel"
                defaultSize={contentPanelSize}
                minSize={20}
            >
                <div className={`h-full flex flex-col bg-background overflow-hidden ${className}`}>
                    {children}
                </div>
            </ResizablePanel>

            {/* Right sidebar - only render when exists */}
            {rightSidebar && (
                <>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        id="right-sidebar-panel"
                        defaultSize={rightSidebarSize}
                        minSize={20}
                        onResize={(size) => {
                            // Update store when user resizes the panel
                            setRightSidebarSize(size);
                        }}
                    >
                        <div className="h-full border-l border-border bg-muted overflow-hidden">
                            {rightSidebar}
                        </div>
                    </ResizablePanel>
                </>
            )}
        </ResizablePanelGroup>
    );
};
