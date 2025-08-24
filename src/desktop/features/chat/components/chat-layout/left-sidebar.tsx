import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";
import { useViewStateStore } from "@/core/stores/view-state.store";
import { ReactNode } from "react";

interface LeftSidebarProps {
    children: ReactNode;
    width?: string;
    collapsedWidth?: string;
    className?: string;
}

export const LeftSidebar = ({ 
    children, 
    width = "w-70", 
    collapsedWidth = "w-0",
    className = "" 
}: LeftSidebarProps) => {
    const { isLeftSidebarCollapsed, setLeftSidebarCollapsed } = useViewStateStore();

    const handleCollapseChange = (collapsed: boolean) => {
        setLeftSidebarCollapsed(collapsed);
    };

    return (
        <CollapsibleSidebar
            width={width}
            collapsedWidth={collapsedWidth}
            className={className}
            collapsed={isLeftSidebarCollapsed}
            onCollapseChange={handleCollapseChange}
        >
            <CollapsibleSidebar.Content>
                {children}
            </CollapsibleSidebar.Content>
        </CollapsibleSidebar>
    );
};
