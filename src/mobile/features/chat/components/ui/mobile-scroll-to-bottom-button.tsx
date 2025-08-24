import { ScrollToBottomButton as CommonScrollToBottomButton } from "@/common/features/chat/components/ui/scroll-to-bottom-button";

interface MobileScrollToBottomButtonProps {
    onClick: () => void;
    isVisible: boolean;
}

export const MobileScrollToBottomButton = ({ 
    onClick, 
    isVisible
}: MobileScrollToBottomButtonProps) => {
    return (
        <CommonScrollToBottomButton
            onClick={onClick}
            isVisible={isVisible}
        />
    );
};
