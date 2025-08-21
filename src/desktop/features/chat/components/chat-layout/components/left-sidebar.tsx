import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";
import { ReactNode } from "react";

interface LeftSidebarProps {
    children: ReactNode;
    width?: string;
    collapsedWidth?: string;
    className?: string;
}

export const LeftSidebar = ({ 
    children, 
    width = "w-80", 
    collapsedWidth = "w-0",
    className = "" 
}: LeftSidebarProps) => {
    return (
        <CollapsibleSidebar
            width={width}
            collapsedWidth={collapsedWidth}
            className={className}
        >
            <CollapsibleSidebar.Content>
                {children}
            </CollapsibleSidebar.Content>
        </CollapsibleSidebar>
    );
};
