import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  isVisible?: boolean;
  className?: string;
}

export const FloatingActionButton = ({ 
  onClick, 
  children, 
  ariaLabel, 
  isVisible = true,
  className 
}: FloatingActionButtonProps) => {
  if (!isVisible) return null;

  return (
    <Button
      size="sm"
      variant="secondary"
      className={cn(
        "h-8 w-8 rounded-full p-0 shadow-lg",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
};
