import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/common/components/ui/resizable";
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
            <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
                {/* Left sidebar */}
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                    <div className="h-full border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        {sidebar}
                    </div>
                </ResizablePanel>

                {/* Resizable handle between left sidebar and content */}
                <ResizableHandle withHandle />

                {/* Center content area */}
                <ResizablePanel 
                    defaultSize={rightSidebar ? 65 : 80} 
                    minSize={45}
                    maxSize={rightSidebar ? 65 : 80}
                >
                    <div className="h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
                        {content}
                    </div>
                </ResizablePanel>

                {/* Right sidebar - force fixed width with strong CSS constraints */}
                {rightSidebar && (
                    <>
                        {/* Resizable handle between content and right sidebar */}
                        <ResizableHandle withHandle />
                        
                        <ResizablePanel 
                            defaultSize={25} 
                            minSize={20}
                            maxSize={35}
                        >
                            <div className="h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                                {rightSidebar}
                            </div>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
};
