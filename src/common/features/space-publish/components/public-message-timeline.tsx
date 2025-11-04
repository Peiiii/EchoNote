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
      <div className="text-center py-12">
        <p className="text-muted-foreground">This space doesn't have any messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        if (item.type === "date-divider") {
          return (
            <div key={`date-${item.date}-${index}`} className="sticky top-0 z-10 bg-background py-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm font-medium text-muted-foreground">{item.date}</span>
                <div className="flex-1 h-px bg-border" />
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

