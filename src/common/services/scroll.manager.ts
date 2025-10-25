export type TimelineScrollAlign = "start" | "center" | "end";
export type TimelineScrollBehavior = "auto" | "smooth";

export interface TimelineVirtualScrollApi {
  scrollToMessageId: (
    messageId: string,
    options?: { align?: TimelineScrollAlign; behavior?: TimelineScrollBehavior }
  ) => boolean;
}

export class ScrollManager {
  private scrollContainerRef: React.RefObject<HTMLDivElement | null> | null = null;
  private timelineVirtualScrollApi: TimelineVirtualScrollApi | null = null;

  setScrollContainerRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    this.scrollContainerRef = ref;
  };

  setTimelineVirtualScrollApi = (api: TimelineVirtualScrollApi | null) => {
    this.timelineVirtualScrollApi = api;
  };

  getScrollContainer = () => {
    return this.scrollContainerRef?.current;
  };

  getTimelineVirtualScrollApi = () => {
    return this.timelineVirtualScrollApi;
  };
}
