import { ReactNode } from "react";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";

interface MobileContentAreaProps {
    children: ReactNode;
    rightSidebar?: ReactNode;
    className?: string;
}

export const MobileContentArea = ({ children, rightSidebar, className = "" }: MobileContentAreaProps) => {
    // 移动端右侧边栏使用滑动模式
    const isRightSidebarOpen = !!rightSidebar;

    return (
        <div className="flex-1 min-h-0 relative">
            {/* Main content area */}
            <div className={`h-full flex flex-col bg-background overflow-hidden ${className}`}>
                {children}
            </div>

            {/* Right sidebar - slides in from right on mobile */}
            {rightSidebar && (
                <Sheet open={isRightSidebarOpen} onOpenChange={() => {}}>
                    <SheetContent 
                        side="right" 
                        className="w-full max-w-md p-0 border-l border-border"
                    >
                        <div className="h-full overflow-hidden">
                            {rightSidebar}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </div>
    );
};
