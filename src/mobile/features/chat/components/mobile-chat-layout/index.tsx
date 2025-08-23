import { MobileChatLayoutProps } from "./types";
import { MobileContentArea } from "./components/mobile-content-area";

export const MobileChatLayout = ({ sidebar, content, rightSidebar, className = "" }: MobileChatLayoutProps) => {
    return (
        <div className={`flex-1 flex flex-col bg-background ${className} overflow-hidden`}>
            <div className="flex-1 flex min-h-0 relative">
                {/* Mobile content area with optional right sidebar */}
                <MobileContentArea rightSidebar={rightSidebar}>
                    {content}
                </MobileContentArea>
                
                {/* Mobile sidebar - rendered as overlay/drawer */}
                {sidebar}
            </div>
        </div>
    );
};
