import { FileText } from "lucide-react";

export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                No thoughts yet
            </h3>
            <p className="text-muted-foreground max-w-sm">
                Start your first thought by typing a message below. Your AI assistant will help you explore ideas and insights.
            </p>
        </div>
    );
};
