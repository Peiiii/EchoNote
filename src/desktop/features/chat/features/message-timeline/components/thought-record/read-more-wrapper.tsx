import { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronUp } from 'lucide-react';
import { cn } from '@/common/lib/utils';

// 可复用的按钮组件
interface ReadMoreButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    icon: React.ReactNode;
    className?: string;
}

function ReadMoreButton({ onClick, children, icon, className = "" }: ReadMoreButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center gap-1.5 px-4 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm rounded-full shadow-sm border border-white/40 dark:border-slate-700/40 hover:bg-slate-100/30 dark:hover:bg-slate-800/25 transition-all duration-200 font-normal ${className}`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}

interface ReadMoreWrapperProps {
    children: React.ReactNode;
    maxHeight?: number;
    className?: string;
    buttonText?: {
        expand: string;
        collapse: string;
    };
}

export function ReadMoreWrapper({
    children,
    maxHeight = 300,
    className = "",
    buttonText = {
        expand: "Expand Thoughts",
        collapse: "Collapse"
    }
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
        <div className={cn(className, "flex flex-col overflow-hidden")}>
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
                        {/* 适中的渐变遮罩：可见但优雅，呈现哲学般的宁静美感 */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/70 via-white/40 to-transparent dark:from-slate-950/60 dark:via-slate-950/35 dark:to-transparent"
                        />
                        {/* 展开按钮容器：苹果风格的安静设计 */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                            <ReadMoreButton
                                onClick={toggleExpanded}
                                icon={<Sparkles className="w-3 h-3 text-slate-400/70 dark:text-slate-500/70 transition-transform duration-200 group-hover:rotate-12" />}
                            >
                                {buttonText.expand}
                            </ReadMoreButton>
                        </div>
                    </div>
                )}

                {/* 收起按钮：与展开按钮保持苹果风格的一致性 */}
                {isExpanded && showReadMore && (
                    <div className="flex justify-center mt-3">
                        <ReadMoreButton
                            onClick={toggleExpanded}
                            icon={<ChevronUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />}
                        >
                            {buttonText.collapse}
                        </ReadMoreButton>
                    </div>
                )}
            </div>
        </div>
    );
}
