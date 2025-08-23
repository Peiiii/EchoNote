import { ReactNode } from "react";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";

interface MobileLeftSidebarProps {
    children: ReactNode;
    className?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const MobileLeftSidebar = ({ 
    children, 
    className = "", 
    isOpen = false,
    onOpenChange 
}: MobileLeftSidebarProps) => {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent 
                side="left" 
                className={`w-80 p-0 border-r border-border ${className}`}
            >
                {children}
            </SheetContent>
        </Sheet>
    );
};
