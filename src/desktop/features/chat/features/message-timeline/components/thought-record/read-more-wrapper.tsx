import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/common/lib/utils';

// 可复用的按钮组件
interface ReadMoreButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    className?: string;
}

function ReadMoreButton({ onClick, icon, className = "" }: ReadMoreButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center justify-center w-8 h-8 bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-full shadow-sm border border-border/50 transition-all duration-200 font-normal ${className}`}
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

                {/* 哲学美感的渐变遮罩 */}
                {!isExpanded && showReadMore && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div
                            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/70 via-white/40 to-transparent dark:from-transparent dark:via-transparent dark:to-transparent"
                        />
                        <div className="absolute bottom-1 left-1/2 pointer-events-auto">
                            <ReadMoreButton
                                onClick={toggleExpanded}
                                icon={<ChevronDown className="w-3 h-3 text-slate-400/70 dark:text-slate-500/70 transition-transform duration-200" />}
                            />
                        </div>
                    </div>
                )}

                {isExpanded && showReadMore && (
                    <div className="flex justify-center">
                        <ReadMoreButton
                            onClick={toggleExpanded}
                            icon={<ChevronUp className="w-3.5 h-3.5 transition-transform duration-200" />}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
