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
    <div className="w-full py-4 border-b border-border/50 last:border-b-0">
      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{formatTimeForSocial(message.timestamp)}</span>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <MarkdownContent content={message.content} />
      </div>
    </div>
  );
}

