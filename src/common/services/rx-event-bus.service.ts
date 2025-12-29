import { RxEvent } from "@/common/lib/rx-event";
import { Message } from "@/core/stores/notes-data.store";

export class RxEventBusService {
  // Navigation events
  // Request the UI to navigate to a specific message, switching channel if necessary
  requestJumpToMessage$ = new RxEvent<{ channelId: string; messageId: string }>();

  // Timeline v2: latest on top
  requestTimelineScrollToLatest$ = new RxEvent<{ behavior?: "smooth" | "instant" } | void>();
  /**
   * Deprecated alias: keep backward compatibility. Both properties refer to the same RxEvent instance.
   * Old callers emitting on `requestTimelineScrollToBottom$` will still wake listeners on `requestTimelineScrollToLatest$`.
   */
  requestTimelineScrollToBottom$ = this.requestTimelineScrollToLatest$;

  onHistoryMessagesLoadedEvent$ = new RxEvent<Message[]>();
}
