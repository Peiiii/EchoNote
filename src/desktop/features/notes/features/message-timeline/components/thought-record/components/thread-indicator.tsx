import { MessageCircle } from "lucide-react";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";

interface ThreadIndicatorProps {
  threadCount: number;
  messageId: string;
}

export function ThreadIndicator({ threadCount, messageId }: ThreadIndicatorProps) {
  const displayText = threadCount > 0 ? `${threadCount} replies` : "Start discussion";

  const handleOpenThread = () => {
    rxEventBusService.requestOpenThread$.emit({ messageId });
  };

  return (
    <button
      onClick={handleOpenThread}
      className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 cursor-pointer"
    >
      <MessageCircle className="w-3 h-3" />
      <span>{displayText}</span>
    </button>
  );
}
