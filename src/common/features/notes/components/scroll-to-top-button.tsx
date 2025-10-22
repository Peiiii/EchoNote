import { ChevronUp } from "lucide-react";
import { FloatingActionButton } from "@/common/components/ui/floating-action-button";

interface ScrollToTopButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export const ScrollToTopButton = ({ onClick, isVisible }: ScrollToTopButtonProps) => {
  return (
    <FloatingActionButton onClick={onClick} isVisible={isVisible} ariaLabel="Scroll to top">
      <ChevronUp className="h-4 w-4" />
    </FloatingActionButton>
  );
};

