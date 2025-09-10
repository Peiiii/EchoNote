import { ChatLayoutProps } from "./types";
import { LeftSidebar } from "./left-sidebar";
import { ContentArea } from "./content-area";

export const ChatLayout = ({ sidebar, content, rightSidebar, className = "" }: ChatLayoutProps) => {
    return (
        <div className={`flex-1 flex flex-col bg-background ${className} overflow-hidden`}>
            <div className="flex-1 flex min-h-0 relative">
                {/* Left sidebar */}
                <LeftSidebar className="bg-card dark:bg-sidebar">
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
