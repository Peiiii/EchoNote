import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/common/components/ui/resizable";
import { ReactNode } from "react";

interface ChatLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
    rightSidebar?: ReactNode; // Right sidebar
    className?: string;
}

export const ChatLayout = ({ sidebar, content, rightSidebar, className = "" }: ChatLayoutProps) => {
    return (
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${className} overflow-hidden`}>
            <div className="flex-1 flex min-h-0 relative">
                {/* Left sidebar - using reusable CollapsibleSidebar component */}
                <CollapsibleSidebar
                    width="w-80"
                    collapsedWidth="w-0"
                >
                    <CollapsibleSidebar.Content>
                        {sidebar}
                    </CollapsibleSidebar.Content>
                </CollapsibleSidebar>

                {/* Content area - always use ResizablePanelGroup for consistency */}
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
                        <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
                            {content}
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
            </div>
        </div>
    );
};
