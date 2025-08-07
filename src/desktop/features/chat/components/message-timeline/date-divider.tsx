import { format } from "date-fns";

interface DateDividerProps {
    date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
    const formattedDate = format(new Date(date), 'MMMM dd, yyyy');
    
    return (
        <div className="flex items-center justify-center py-6">
            <div className="relative">
                {/* Background pill with subtle shadow */}
                <div className="px-6 py-2 bg-slate-100/80 dark:bg-slate-800/60 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide">
                        {formattedDate}
                    </span>
                </div>
                
                {/* Subtle decorative elements */}
                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-px bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-600"></div>
                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-px bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-600"></div>
            </div>
        </div>
    );
}; 