import { format } from "date-fns";

interface DateDividerProps {
    date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => (
    <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative bg-white dark:bg-slate-900 px-4">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {format(new Date(date), 'MMMM dd, yyyy')}
            </div>
        </div>
    </div>
); 