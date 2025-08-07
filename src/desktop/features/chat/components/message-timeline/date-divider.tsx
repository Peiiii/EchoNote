import { format } from "date-fns";

interface DateDividerProps {
    date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
    const formattedDate = format(new Date(date), 'MMMM dd, yyyy');
    
    return (
        <div className="flex items-center justify-center py-4">
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {formattedDate}
                </span>
            </div>
        </div>
    );
}; 