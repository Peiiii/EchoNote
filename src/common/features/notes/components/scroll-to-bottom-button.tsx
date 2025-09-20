import { ChevronDown } from "lucide-react";
import { FloatingActionButton } from "@/common/components/ui/floating-action-button";

interface ScrollToBottomButtonProps {
    onClick: () => void;
    isVisible: boolean;
}

export const ScrollToBottomButton = ({ onClick, isVisible }: ScrollToBottomButtonProps) => {
    return (
        <FloatingActionButton
            onClick={onClick}
            isVisible={isVisible}
            ariaLabel="Scroll to bottom"
        >
            <ChevronDown className="h-4 w-4" />
        </FloatingActionButton>
    );
};
