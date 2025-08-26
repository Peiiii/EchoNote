import { useState, useRef, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MobileReadMoreWrapperProps {
    children: React.ReactNode;
    maxHeight: number;
    className?: string;
}

export function MobileReadMoreWrapper({ 
    children, 
    maxHeight, 
    className = "" 
}: MobileReadMoreWrapperProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            setShowReadMore(contentHeight > maxHeight);
        }
    }, [children, maxHeight]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={className}>
            <div
                ref={contentRef}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-none' : `max-h-[${maxHeight}px]`
                }`}
                style={{
                    maxHeight: isExpanded ? 'none' : `${maxHeight}px`
                }}
            >
                {children}
            </div>
            
            {showReadMore && (
                <div className="flex justify-center mt-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleExpanded}
                        className="h-8 px-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3 h-3 mr-1" />
                                Show Less
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Read More
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
