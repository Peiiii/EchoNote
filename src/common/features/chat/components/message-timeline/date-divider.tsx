interface DateDividerProps {
    date: string;
}

export const DateDivider = ({ date }: DateDividerProps) => {
    return (
        <div className="flex items-center justify-center py-4">
            <div className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                {date}
            </div>
        </div>
    );
};
