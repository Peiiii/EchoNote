import { MarkdownContent } from "@/common/components/markdown";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Message } from "@/core/stores/notes-data.store";
import { Clock } from "lucide-react";

interface PublicMessageItemProps {
  message: Message;
}

export function PublicMessageItem({ message }: PublicMessageItemProps) {
  if (message.isDeleted) {
    return null;
  }

  return (
    <div className="group relative w-full">
      <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border">
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{formatTimeForSocial(message.timestamp)}</span>
          </div>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-p:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
          <MarkdownContent content={message.content} />
        </div>
      </div>
    </div>
  );
}

