import { RxEvent } from "@/common/lib/rx-event";
import { Message } from "@/core/stores/notes-data.store";

export class RxEventBusService {
  // Navigation events
  // Request the UI to navigate to a specific message, switching channel if necessary
  requestJumpToMessage$ = new RxEvent<{ channelId: string; messageId: string }>();

  requestTimelineScrollToBottom$ = new RxEvent<{ behavior?: "smooth" | "instant" } | void>();

  onHistoryMessagesLoadedEvent$ = new RxEvent<Message[]>();
}
