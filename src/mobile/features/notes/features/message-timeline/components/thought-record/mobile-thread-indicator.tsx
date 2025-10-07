import { Button } from '@/common/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { rxEventBusService } from '@/common/services/rx-event-bus.service';
import { getFeaturesConfig } from '@/core/config/features.config';

interface MobileThreadIndicatorProps {
    threadCount: number;
    messageId: string;
}

export function MobileThreadIndicator({ 
    threadCount, 
    messageId 
}: MobileThreadIndicatorProps) {
    if (!getFeaturesConfig().channel.thoughtRecord.thread.enabled) {
        return null;
    }

    const handleOpenThread = () => {
        rxEventBusService.requestOpenThread$.emit({ messageId });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenThread}
            className="h-7 px-3 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
        >
            <MessageCircle className="w-3 h-3 mr-1.5" />
            {threadCount}
        </Button>
    );
}
