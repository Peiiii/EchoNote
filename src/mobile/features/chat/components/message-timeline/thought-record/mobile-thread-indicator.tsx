import { Button } from '@/common/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface MobileThreadIndicatorProps {
    threadCount: number;
    onOpenThread?: (messageId: string) => void;
    messageId: string;
}

export function MobileThreadIndicator({ 
    threadCount, 
    onOpenThread, 
    messageId 
}: MobileThreadIndicatorProps) {
    const displayText = threadCount > 0 ? `${threadCount} replies` : 'Start discussion';
    
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenThread?.(messageId)}
            className="h-8 px-3 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all duration-200"
        >
            <MessageCircle className="w-3 h-3 mr-1" />
            <span>{displayText}</span>
        </Button>
    );
}
