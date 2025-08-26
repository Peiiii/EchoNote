import { ScrollToBottomButton as CommonScrollToBottomButton } from "@/desktop/features/chat/features/message-timeline";

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
