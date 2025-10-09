import {
  ReactNode,
  createContext,
  useContext,
  useState,
  ButtonHTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/common/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";

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
  modal?: boolean;
}

const RefinedPopoverRoot = ({ children, open, onOpenChange, modal }: RefinedPopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const handleOpenChange = onOpenChange || setInternalOpen;

  const contextValue: RefinedPopoverContextType = {
    isOpen,
    onOpenChange: handleOpenChange,
  };

  return (
    <RefinedPopoverContext.Provider value={contextValue}>
      <Popover open={isOpen} onOpenChange={handleOpenChange} modal={modal}>
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
  return <div className={cn("flex items-center gap-2.5 mb-5", className)}>{children}</div>;
};

// Content component
interface RefinedPopoverContentProps {
  children: ReactNode;
  className?: string;
}

const RefinedPopoverContent = ({ children, className = "" }: RefinedPopoverContentProps) => {
  return <div className={cn("space-y-4", className)}>{children}</div>;
};

// Actions component
interface RefinedPopoverActionsProps {
  children: ReactNode;
  className?: string;
}

const RefinedPopoverActions = ({ children, className = "" }: RefinedPopoverActionsProps) => {
  return <div className={cn("flex justify-end gap-2.5 pt-3 mt-2", className)}>{children}</div>;
};

// Trigger component
const RefinedPopoverTrigger = PopoverTrigger;

// Button component
interface RefinedPopoverButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md";
}

const RefinedPopoverButton = forwardRef<HTMLButtonElement, RefinedPopoverButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseClasses =
      "h-8 px-4 rounded-lg text-sm transition-all duration-200 font-medium flex items-center justify-center";

    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "text-muted-foreground hover:text-foreground hover:bg-accent/30",
      ghost: "text-muted-foreground hover:text-foreground hover:bg-accent/30",
    };

    const sizeClasses = {
      sm: "h-7 px-3 text-xs",
      md: "h-8 px-4 text-sm",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

RefinedPopoverButton.displayName = "RefinedPopoverButton";

// Content wrapper with styling
interface RefinedPopoverContentWrapperProps {
  children: ReactNode;
  width?: string;
  className?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  onInteractOutside?: (e: Event) => void;
}

const RefinedPopoverContentWrapper = ({
  children,
  width = "w-80",
  className = "",
  align = "center",
  side = "bottom",
  sideOffset = 6,
  onInteractOutside,
}: RefinedPopoverContentWrapperProps) => {
  return (
    <PopoverContent
      className={cn(
        width,
        "p-4 border border-slate-200/60 dark:border-slate-700/60 shadow-lg bg-popover text-popover-foreground rounded-xl overflow-hidden max-w-[90vw] max-h-[70vh] mr-4 sm:mr-0",
        className
      )}
      align={align}
      side={side}
      sideOffset={sideOffset}
      onInteractOutside={onInteractOutside}
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
  Button: RefinedPopoverButton,
});

// Export the hook for external use
export { useRefinedPopover };
