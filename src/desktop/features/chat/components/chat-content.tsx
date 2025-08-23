import { ReactNode } from "react";

interface ChatContentProps {
    timeline: ReactNode;
    input: ReactNode;
    scrollButton?: ReactNode;
    className?: string;
}

export const ChatContent = ({ timeline, input, scrollButton, className = "" }: ChatContentProps) => {
    return (
        <div data-component="chat-content" className={`flex-1 flex flex-col h-full ${className}`}>
            <div className="flex-1 flex flex-col min-h-0">
                {timeline}
                {scrollButton}
            </div>
            {input}
        </div>
    );
};
