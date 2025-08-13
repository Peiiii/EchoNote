import { ReactNode } from "react";

interface ChatLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
    rightSidebar?: ReactNode; // Right sidebar
    className?: string;
}

export const ChatLayout = ({ sidebar, content, rightSidebar, className = "" }: ChatLayoutProps) => {
    return (
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${className}`}>
            <div className="flex-1 flex min-h-0">
                {/* Left sidebar */}
                <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    {sidebar}
                </div>

                {/* Center content area */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                    {content}
                </div>

                {/* Right sidebar - conditional rendering */}
                {rightSidebar && (
                    <div className="w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                        {rightSidebar}
                    </div>
                )}
            </div>
        </div>
    );
};
