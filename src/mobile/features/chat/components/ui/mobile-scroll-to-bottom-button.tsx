import { Button } from "@/common/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/common/lib/utils";

interface MobileScrollToBottomButtonProps {
    onClick: () => void;
    className?: string;
}

export const MobileScrollToBottomButton = ({ onClick, className = "" }: MobileScrollToBottomButtonProps) => {
    return (
        <Button
            onClick={onClick}
            size="icon"
            className={cn(
                "fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full shadow-lg",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "transition-all duration-200 ease-in-out",
                className
            )}
        >
            <ChevronDown className="h-5 w-5" />
        </Button>
    );
};
