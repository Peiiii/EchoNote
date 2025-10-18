import { RxEventBusService } from "./rx-event-bus.service";


export class CommonPresenter {
    public readonly rxEventBus: RxEventBusService = new RxEventBusService();
}