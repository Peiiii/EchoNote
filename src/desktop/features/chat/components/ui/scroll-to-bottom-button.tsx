import { ChevronDown } from "lucide-react";

interface ScrollToBottomButtonProps {
    onClick: () => void;
    className?: string;
    title?: string;
}

export const ScrollToBottomButton = ({ 
    onClick, 
    className = "",
    title = "Scroll to bottom" 
}: ScrollToBottomButtonProps) => {
    return (
        <div className={`absolute bottom-4 right-4 z-10 ${className}`}>
            <button
                onClick={onClick}
                className="w-8 h-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white dark:hover:bg-slate-800 group"
                title={title}
            >
                <ChevronDown className="w-4 h-4 mx-auto group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
            </button>
        </div>
    );
};
