import { ReactNode } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/common/components/ui/resizable";

interface ChatLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
    rightSidebar?: ReactNode; // Right sidebar
    className?: string;
}

export const ChatLayout = ({ sidebar, content, rightSidebar, className = "" }: ChatLayoutProps) => {
    return (
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${className}`}>
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
                <ResizablePanel defaultSize={rightSidebar ? 60 : 80} minSize={40}>
                    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
                        {content}
                    </div>
                </ResizablePanel>

                {/* Right sidebar - conditional rendering with resizable */}
                {rightSidebar && (
                    <>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                            <div className="h-full border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                {rightSidebar}
                            </div>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
        </div>
    );
};
