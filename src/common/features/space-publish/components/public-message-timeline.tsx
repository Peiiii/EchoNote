import { Message } from "@/core/stores/notes-data.store";
import { useMemo } from "react";
import { PublicMessageItem } from "./public-message-item";

interface PublicMessageTimelineProps {
  groupedMessages: Record<string, Message[]>;
}

interface TimelineItem {
  type: "date-divider" | "message";
  date?: string;
  message?: Message;
}

export function PublicMessageTimeline({
  groupedMessages,
}: PublicMessageTimelineProps) {
  const items = useMemo(() => {
    const list: TimelineItem[] = [];
    Object.entries(groupedMessages).forEach(([date, dayMessages]) => {
      list.push({
        type: "date-divider",
        date,
      });
      dayMessages
        .filter(msg => msg.sender === "user" && !msg.parentId && !msg.isDeleted)
        .forEach((message: Message) => {
          list.push({
            type: "message",
            message,
          });
        });
    });
    return list;
  }, [groupedMessages]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-muted-foreground font-medium">This space doesn't have any messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-full overflow-x-hidden">
      {items.map((item, index) => {
        if (item.type === "date-divider") {
          return (
            <div key={`date-${item.date}-${index}`} className="py-4 w-full max-w-full overflow-x-hidden">
              <div className="flex items-center gap-4 w-full max-w-full">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-border min-w-0" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1 bg-card rounded-full border border-border/50 shadow-sm shrink-0">
                  {item.date}
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-border min-w-0" />
              </div>
            </div>
          );
        }
        if (item.message) {
          return <PublicMessageItem key={item.message.id} message={item.message} />;
        }
        return null;
      })}
    </div>
  );
}

