import { useState, useRef, useEffect } from 'react';
import { ChevronUp, Sparkles } from 'lucide-react';

interface ReadMoreWrapperProps {
    children: React.ReactNode;
    maxHeight?: number;
    className?: string;
    showButton?: boolean;
    buttonText?: {
        expand: string;
        collapse: string;
    };
    maskHeight?: number;
    buttonAlign?: 'left' | 'center'; 
}

export function ReadMoreWrapper({ 
    children, 
    maxHeight = 300, 
    className = "",
    showButton = true,
    buttonText = {
        expand: "Expand Thoughts",
        collapse: "Collapse"
    },
    maskHeight = 16,
    buttonAlign = 'center'
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
        <div className={className}>
            <div className="relative">
                <div 
                    ref={contentRef}
                    className={`transition-all duration-500 ease-out ${
                        !isExpanded && showReadMore ? 'overflow-hidden' : ''
                    }`}
                    style={{
                        maxHeight: !isExpanded && showReadMore ? `${maxHeight}px` : 'none',
                        height: !isExpanded && showReadMore ? `${maxHeight}px` : 'auto'
                    }}
                >
                    {children}
                </div>

                {!isExpanded && showReadMore && (
                    <div 
                        className="absolute bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-t from-white via-white/60 to-transparent dark:from-slate-900/80 dark:via-slate-900/40 dark:to-transparent"
                        style={{
                            height: `${maskHeight * 4}px`
                        }}
                    />
                )}
            </div>

            {/* Enhanced Read More Button */}
            {showReadMore && showButton && (
                <div className={`flex ${buttonAlign === 'left' ? 'justify-start' : 'justify-center'} mt-3`}>
                    <button
                        onClick={toggleExpanded}
                        className="group flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/30 rounded-md transition-all duration-400 font-normal border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50 hover:shadow-sm"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                                <span>{buttonText.collapse}</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3.5 h-3.5 text-slate-500/70 dark:text-slate-400/70 transition-transform duration-200 group-hover:rotate-12" />
                                <span>{buttonText.expand}</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
