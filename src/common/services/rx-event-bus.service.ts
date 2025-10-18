import { RxEvent } from "@/common/lib/rx-event";

export class RxEventBusService {
  // Navigation events
  // Request the UI to navigate to a specific message, switching channel if necessary
  requestJumpToMessage$ = new RxEvent<{ channelId: string; messageId: string }>();
}
