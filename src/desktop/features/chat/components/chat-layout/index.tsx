import { ChatLayoutProps } from "./types";
import { LeftSidebar } from "./components/left-sidebar";
import { ContentArea } from "./components/content-area";

export const ChatLayout = ({ sidebar, content, rightSidebar, className = "" }: ChatLayoutProps) => {
    return (
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${className} overflow-hidden`}>
            <div className="flex-1 flex min-h-0 relative">
                {/* Left sidebar */}
                <LeftSidebar>
                    {sidebar}
                </LeftSidebar>

                {/* Content area with optional right sidebar */}
                <ContentArea rightSidebar={rightSidebar}>
                    {content}
                </ContentArea>
            </div>
        </div>
    );
};
