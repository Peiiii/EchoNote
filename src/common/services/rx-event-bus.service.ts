import { RxEvent } from "@/common/lib/rx-event";

export class RxEventBusService {
    // AI Assistant events
    requestOpenAIAssistant$ = new RxEvent<{ channelId: string }>();
    
    // Thread management events
    requestOpenThread$ = new RxEvent<{ messageId: string }>();
    requestCloseThread$ = new RxEvent<void>();
    
    // Settings events
    requestOpenSettings$ = new RxEvent<{ channelId?: string }>();
}

export const rxEventBusService = new RxEventBusService();