import { format } from "date-fns";

interface DateDividerProps {
    date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
    const formattedDate = format(new Date(date), 'MMM dd, yyyy');
    
    return (
        <div className="flex items-center justify-center py-4">
            <div className="relative">
                <div className="px-4 py-1.5 bg-slate-50/60 dark:bg-slate-900/40 rounded-lg">
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 tracking-wide">
                        {formattedDate}
                    </span>
                </div>
                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-px bg-slate-200/30 dark:bg-slate-700/40"></div>
                <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 w-8 h-px bg-slate-200/30 dark:bg-slate-700/40"></div>
            </div>
        </div>
    );
};
