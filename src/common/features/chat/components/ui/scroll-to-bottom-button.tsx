import { ChevronDown } from "lucide-react";
import { Button } from "@/common/components/ui/button";

interface ScrollToBottomButtonProps {
    onClick: () => void;
    isVisible: boolean;
}

export const ScrollToBottomButton = ({ onClick, isVisible }: ScrollToBottomButtonProps) => {
    if (!isVisible) return null;

    return (
        <Button
            onClick={onClick}
            size="sm"
            variant="secondary"
            className="fixed bottom-20 right-4 z-50 h-8 w-8 rounded-full p-0 shadow-lg"
        >
            <ChevronDown className="h-4 w-4" />
        </Button>
    );
};
