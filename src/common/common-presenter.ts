import { useUIStateStore } from "@/core/stores/ui-state.store";
import { RxEventBusService } from "./services/rx-event-bus.service";
import { ThreadManager } from "./services/thread-manager.service";

export class CommonPresenter {
  public readonly rxEventBus: RxEventBusService = new RxEventBusService();
  public readonly threadManager: ThreadManager = new ThreadManager();

  openAIAssistant = () => {
    useUIStateStore.getState().openAIAssistant();
  };

  openThread = ({ messageId }: { messageId: string }) => {
    useUIStateStore.getState().openThread(messageId);
  };

  closeThread = () => {
    useUIStateStore.getState().closeThread();
  };

  closeAIAssistant = () => {
    useUIStateStore.getState().closeAIAssistant();
  };

  openSettings = () => {
    useUIStateStore.getState().openSettings();
  };

  jumpToNote = (options: { channelId: string; messageId: string }) => {
    this.rxEventBus.requestJumpToMessage$.emit(options);
  };
}
