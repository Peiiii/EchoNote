import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/common/lib/utils';
import { readMoreBus } from '@/common/features/notes/components/message-timeline/read-more.bus';

interface MobileReadMoreWrapperProps {
    children: React.ReactNode;
    maxHeight?: number;
    className?: string;
    messageId: string;
}

export function MobileReadMoreWrapper({ 
    children, 
    maxHeight = 600, 
    className = "",
    messageId
}: MobileReadMoreWrapperProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            setShowReadMore(contentHeight > maxHeight + 24);
        }
    }, [children, maxHeight]);

    useEffect(() => {
        readMoreBus.statusChanged$.emit({ messageId, long: showReadMore, expanded: isExpanded, collapseInlineVisible: false });
    }, [messageId, showReadMore, isExpanded]);

    useEffect(() => {
        return readMoreBus.requestCollapse$.listen(({ messageId: target }) => {
            if (target === messageId && isExpanded) setIsExpanded(false);
        });
    }, [messageId, isExpanded]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const collapseBtnRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        const root = contentRef.current?.closest('[data-component="message-timeline"]') as HTMLElement | null;
        const node = collapseBtnRef.current;
        if (!root || !node || !isExpanded || !showReadMore) {
            readMoreBus.statusChanged$.emit({ messageId, long: showReadMore, expanded: isExpanded, collapseInlineVisible: false });
            return;
        }
        const io = new IntersectionObserver((entries) => {
            const vis = entries[0]?.isIntersecting ?? false;
            readMoreBus.statusChanged$.emit({ messageId, long: showReadMore, expanded: isExpanded, collapseInlineVisible: vis });
        }, { root, threshold: 0.01 });
        io.observe(node);
        return () => io.disconnect();
    }, [messageId, isExpanded, showReadMore]);

    return (
        <div className={cn('relative group', className)}>
            <div
                ref={contentRef}
                className={cn('transition-all duration-300 ease-in-out', !isExpanded && showReadMore ? 'overflow-hidden' : '')}
                style={{
                    maxHeight: !isExpanded && showReadMore ? `${maxHeight}px` : 'none'
                }}
            >
                {children}
            </div>

            {!isExpanded && showReadMore && (
                <>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
                    <button
                        type="button"
                        onClick={toggleExpanded}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm text-muted-foreground shadow-none border-0 flex items-center gap-1 active:scale-[0.98]"
                    >
                        <span>Read more</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </>
            )}
            {isExpanded && showReadMore && (
                <button
                    type="button"
                    data-collapse-inline-for={messageId}
                    ref={collapseBtnRef}
                    onClick={toggleExpanded}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm text-muted-foreground shadow-none border-0 flex items-center gap-1 active:scale-[0.98]"
                >
                    <ChevronUp className="w-3 h-3" />
                    <span>Collapse</span>
                </button>
            )}
        </div>
    );
}
