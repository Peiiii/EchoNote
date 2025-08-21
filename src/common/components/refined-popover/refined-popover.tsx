import { ReactNode, createContext, useContext, useState } from "react";
import { cn } from "@/common/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";

// Context for internal communication
interface RefinedPopoverContextType {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RefinedPopoverContext = createContext<RefinedPopoverContextType | null>(null);

// Hook to use the context
const useRefinedPopover = () => {
  const context = useContext(RefinedPopoverContext);
  if (!context) {
    throw new Error("useRefinedPopover must be used within RefinedPopover");
  }
  return context;
};

// Main container component
interface RefinedPopoverProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
}

const RefinedPopoverRoot = ({
  children,
  open,
  onOpenChange
}: RefinedPopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  const contextValue: RefinedPopoverContextType = {
    isOpen,
    onOpenChange: handleOpenChange
  };

  return (
    <RefinedPopoverContext.Provider value={contextValue}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        {children}
      </Popover>
    </RefinedPopoverContext.Provider>
  );
};

// Header component
interface RefinedPopoverHeaderProps {
  children: ReactNode;
  className?: string;
}

const RefinedPopoverHeader = ({ children, className = "" }: RefinedPopoverHeaderProps) => {
  return (
    <div className={cn(
      "px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30",
      className
    )}>
      {children}
    </div>
  );
};

// Content component
interface RefinedPopoverContentProps {
  children: ReactNode;
  className?: string;
}

const RefinedPopoverContent = ({ children, className = "" }: RefinedPopoverContentProps) => {
  return (
    <div className={cn("px-5 pt-5 pb-0 space-y-5", className)}>
      {children}
    </div>
  );
};

// Actions component
interface RefinedPopoverActionsProps {
  children: ReactNode;
  className?: string;
}

const RefinedPopoverActions = ({ children, className = "" }: RefinedPopoverActionsProps) => {
  return (
    <div className={cn("px-5 pb-5 pt-2 flex items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
};

// Trigger component
const RefinedPopoverTrigger = PopoverTrigger;

// Content wrapper with styling
interface RefinedPopoverContentWrapperProps {
  children: ReactNode;
  width?: string;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const RefinedPopoverContentWrapper = ({ 
  children, 
  width = "w-88",
  className = "",
  align = "center",
  side = "bottom",
  sideOffset = 8
}: RefinedPopoverContentWrapperProps) => {
  return (
    <PopoverContent 
      className={cn(
        width,
        "p-0 border border-slate-200/60 dark:border-slate-700/60 shadow-lg bg-white dark:bg-slate-900 rounded-xl overflow-hidden",
        className
      )}
      align={align}
      side={side}
      sideOffset={sideOffset}
    >
      {children}
    </PopoverContent>
  );
};

// Export the namespace object
export const RefinedPopover = Object.assign(RefinedPopoverRoot, {
  Trigger: RefinedPopoverTrigger,
  Content: RefinedPopoverContentWrapper,
  Header: RefinedPopoverHeader,
  Body: RefinedPopoverContent,
  Actions: RefinedPopoverActions,
});

// Export the hook for external use
export { useRefinedPopover };
