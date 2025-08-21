import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/common/components/ui/resizable";
import { ReactNode } from "react";

interface ContentAreaProps {
    children: ReactNode;
    rightSidebar?: ReactNode;
    className?: string;
}

export const ContentArea = ({ children, rightSidebar, className = "" }: ContentAreaProps) => {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="flex-1 min-h-0"
            key={rightSidebar ? 'with-sidebar' : 'without-sidebar'}
        >
            {/* Center content area */}
            <ResizablePanel
                id="content-panel"
                defaultSize={rightSidebar ? 65 : 100}
                minSize={20}
            >
                <div className={`h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden ${className}`}>
                    {children}
                </div>
            </ResizablePanel>

            {/* Right sidebar - only render when exists */}
            {rightSidebar && (
                <>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        id="right-sidebar-panel"
                        defaultSize={35}
                        minSize={20}
                    >
                        <div className="h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                            {rightSidebar}
                        </div>
                    </ResizablePanel>
                </>
            )}
        </ResizablePanelGroup>
    );
};
