import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Clock } from "lucide-react";

interface DateDividerProps {
    date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => (
    <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative bg-white dark:bg-slate-900 px-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{format(new Date(date), 'MM月dd日 EEEE', { locale: zhCN })}</span>
            </div>
        </div>
    </div>
); 