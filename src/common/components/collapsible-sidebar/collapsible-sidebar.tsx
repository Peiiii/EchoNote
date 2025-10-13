import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/lib/utils";
import { logService, SidebarType, SidebarAction } from "@/core/services/log.service";
import { PanelLeft } from "lucide-react";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

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
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const CollapsibleSidebarRoot = ({
  children,
  width = "w-80",
  collapsedWidth = "w-0",
  className = "",
  collapsed: externalCollapsed,
  onCollapseChange,
}: CollapsibleSidebarProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;

    logService.logSidebarToggle(
      SidebarType.LEFT,
      newCollapsedState ? SidebarAction.CLOSE : SidebarAction.OPEN
    );

    if (externalCollapsed === undefined) {
      setInternalCollapsed(newCollapsedState);
    }

    onCollapseChange?.(newCollapsedState);
  };

  // Sync internal state when external state changes
  useEffect(() => {
    if (externalCollapsed !== undefined) {
      setInternalCollapsed(externalCollapsed);
    }
  }, [externalCollapsed]);

  const contextValue: CollapsibleSidebarContextType = {
    isCollapsed,
    toggleCollapse,
    onCollapseChange,
  };

  return (
    <CollapsibleSidebarContext.Provider value={contextValue}>
      <div
        data-component="collapsible-sidebar"
        className={cn(
          "flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? collapsedWidth : width,
          className
        )}
      >
        <div
          className={cn(
            "h-full flex flex-col transition-opacity duration-300",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}
        >
          {children}
        </div>
      </div>

      {/* Floating expand button removed for cleaner design */}
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
    <div className={cn("flex items-center justify-between p-3 border-b border-border", className)}>
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
        "h-8 w-8 hover:bg-accent transition-all duration-300",
        isCollapsed ? "opacity-0 scale-95" : "opacity-100 scale-100",
        className
      )}
      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {children || <PanelLeft className="h-4 w-4" />}
    </Button>
  );
};

// Expand button component removed for cleaner design

// Content component
interface ContentProps {
  children: ReactNode;
  className?: string;
}

const CollapsibleSidebarContent = ({ children, className = "" }: ContentProps) => {
  return (
    <div
      data-component="collapsible-sidebar-content"
      className={cn("flex-1 overflow-hidden", className)}
    >
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
