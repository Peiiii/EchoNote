import { ReactNode, createContext, useContext, useEffect } from "react";
import { cn } from "@/common/lib/utils";
import { PanelLeft } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { useViewStateStore } from "@/core/stores/view-state.store";

// Context for internal communication
interface CollapsibleSidebarContextType {
    isCollapsed: boolean;
    toggleCollapse: () => void;
    onCollapseChange?: (collapsed: boolean) => void;
}

const CollapsibleSidebarContext = createContext<CollapsibleSidebarContextType | null>(null);

// Hook to use the context
const useCollapsibleSidebar = () => {
    const context = useContext(CollapsibleSidebarContext);
    if (!context) {
        throw new Error("useCollapsibleSidebar must be used within CollapsibleSidebar");
    }
    return context;
};

// Main container component
interface CollapsibleSidebarProps {
    children: ReactNode;
    width?: string;
    collapsedWidth?: string;
    className?: string;
    onCollapseChange?: (collapsed: boolean) => void;
}

const CollapsibleSidebarRoot = ({
    children,
    width = "w-80",
    collapsedWidth = "w-0",
    className = "",
    onCollapseChange
}: CollapsibleSidebarProps) => {
    const { isLeftSidebarCollapsed, toggleLeftSidebar } = useViewStateStore();

    const toggleCollapse = () => {
        toggleLeftSidebar();
    };

    // Sync with external onCollapseChange callback
    useEffect(() => {
        onCollapseChange?.(isLeftSidebarCollapsed);
    }, [isLeftSidebarCollapsed, onCollapseChange]);

    const contextValue: CollapsibleSidebarContextType = {
        isCollapsed: isLeftSidebarCollapsed,
        toggleCollapse,
        onCollapseChange
    };

    return (
        <CollapsibleSidebarContext.Provider value={contextValue}>
            <div 
                className={cn(
                    "flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all duration-300 ease-in-out overflow-hidden",
                    isLeftSidebarCollapsed ? collapsedWidth : width,
                    className
                )}
            >
                <div className={cn(
                    "h-full flex flex-col transition-opacity duration-300",
                    isLeftSidebarCollapsed ? "opacity-0" : "opacity-100"
                )}>
                    {children}
                </div>
            </div>

            {/* Floating expand button when sidebar is collapsed */}
            {isLeftSidebarCollapsed && <CollapsibleSidebarExpandButton />}
        </CollapsibleSidebarContext.Provider>
    );
};

// Header component
interface HeaderProps {
    children: ReactNode;
    className?: string;
}

const CollapsibleSidebarHeader = ({ children, className = "" }: HeaderProps) => {
    return (
        <div className={cn(
            "flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700",
            className
        )}>
            {children}
        </div>
    );
};

// Toggle button component
interface ToggleButtonProps {
    className?: string;
    children?: ReactNode;
}

const CollapsibleSidebarToggleButton = ({ className = "", children }: ToggleButtonProps) => {
    const { isCollapsed, toggleCollapse } = useCollapsibleSidebar();
    
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className={cn(
                "h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300",
                isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100",
                className
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            {children || <PanelLeft className="h-4 w-4" />}
        </Button>
    );
};

// Expand button component
const CollapsibleSidebarExpandButton = () => {
    const { toggleCollapse } = useCollapsibleSidebar();
    
    return (
        <div className="absolute left-0 top-4 z-10 animate-in fade-in slide-in-from-left-2 duration-300">
            <Button
                variant="outline"
                size="sm"
                onClick={toggleCollapse}
                className="h-8 w-8 p-0 rounded-r-md rounded-l-none border-l-0 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md transition-all duration-300"
                title="Expand sidebar"
            >
                <PanelLeft className="h-4 w-4" />
            </Button>
        </div>
    );
};

// Content component
interface ContentProps {
    children: ReactNode;
    className?: string;
}

const CollapsibleSidebarContent = ({ children, className = "" }: ContentProps) => {
    return (
        <div className={cn("flex-1", className)}>
            {children}
        </div>
    );
};

// Export the namespace object
export const CollapsibleSidebar = Object.assign(CollapsibleSidebarRoot, {
    Header: CollapsibleSidebarHeader,
    ToggleButton: CollapsibleSidebarToggleButton,
    Content: CollapsibleSidebarContent,
});

// Export the hook for external use
export { useCollapsibleSidebar };
