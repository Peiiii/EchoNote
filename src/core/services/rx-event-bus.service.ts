import { RxEvent } from "@/common/lib/rx-event";

export class RxEventBusService {
    requestOpenAIAssistant$ = new RxEvent<{ channelId: string }>();
}

export const rxEventBusService = new RxEventBusService();