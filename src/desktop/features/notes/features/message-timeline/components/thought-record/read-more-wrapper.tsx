import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/common/lib/utils';

interface ReadMoreButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    className?: string;
}

function ReadMoreButton({ onClick, icon, className = "" }: ReadMoreButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center justify-center w-8 h-8 bg-white/80 dark:bg-gray-800/80 text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-slate-200 rounded-full shadow-lg border border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/80 dark:hover:border-gray-600/80 hover:shadow-xl transition-all duration-200 font-normal backdrop-blur-sm ${className}`}
        >
            {icon}
        </button>
    );
}

interface ReadMoreWrapperProps {
    children: React.ReactNode;
    maxHeight?: number;
    className?: string;
}

export function ReadMoreWrapper({
    children,
    maxHeight = 300,
    className = "",
}: ReadMoreWrapperProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // 检查内容是否需要readmore按钮
    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            const needsReadMore = contentHeight > maxHeight;
            setShowReadMore(needsReadMore);
        }
    }, [children, maxHeight, isExpanded]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div data-testid="read-more-wrapper" className={cn(className, "flex flex-col overflow-hidden pb-3")}>
            <div className="relative">
                <div
                    ref={contentRef}
                    className={`transition-all duration-500 ease-out ${!isExpanded && showReadMore ? 'overflow-hidden' : ''
                        }`}
                    style={{
                        maxHeight: !isExpanded && showReadMore ? `${maxHeight}px` : 'none',
                        height: !isExpanded && showReadMore ? `${maxHeight}px` : 'auto'
                    }}
                >
                    {children}
                </div>

                {!isExpanded && showReadMore && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div
                            className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100/40 via-gray-100/20 to-transparent dark:from-gray-800/30 dark:via-gray-800/15 dark:to-transparent group-hover:from-gray-100/30 group-hover:via-gray-100/15 dark:group-hover:from-gray-800/20 dark:group-hover:via-gray-800/10 transition-all duration-300"
                        />
                        <div className="absolute bottom-2 flex w-full items-center justify-center pointer-events-auto">
                            <ReadMoreButton
                                onClick={toggleExpanded}
                                icon={<ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />}
                            />
                        </div>
                    </div>
                )}

                {isExpanded && showReadMore && (
                    <div className="flex justify-center pt-2">
                        <ReadMoreButton
                            onClick={toggleExpanded}
                            icon={<ChevronUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
