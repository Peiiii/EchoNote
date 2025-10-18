import { rxEventBusService, RxEventBusService } from "./rx-event-bus.service";


export class CommonPresenter {
    protected readonly rxEventBus: RxEventBusService = rxEventBusService;
}