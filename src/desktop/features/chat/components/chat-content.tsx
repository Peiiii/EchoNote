import { ReactNode } from "react";

interface ChatContentProps {
    timeline: ReactNode;
    input: ReactNode;
    scrollButton?: ReactNode;
    className?: string;
}

export const ChatContent = ({ timeline, input, scrollButton, className = "" }: ChatContentProps) => {
    return (
        <div className={`flex-1 flex flex-col ${className}`}>
            <div className="flex-1 relative min-h-0">
                {timeline}
                {scrollButton}
            </div>
            {input}
        </div>
    );
};
