import { useUIStateStore } from "@/core/stores/ui-state.store";
import { ChannelManager } from "./services/channel-manager.service";
import { RxEventBusService } from "./services/rx-event-bus.service";
import { ThreadManager } from "./services/thread-manager.service";
import { ViewStateManager } from "./services/view-state-manager.service";

export class CommonPresenter {
  readonly rxEventBus: RxEventBusService = new RxEventBusService();
  readonly threadManager: ThreadManager = new ThreadManager();
  readonly channelManager: ChannelManager = new ChannelManager();
  readonly viewStateManager: ViewStateManager = new ViewStateManager();
  
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
  closeSettings = () => {
    useUIStateStore.getState().closeSettings();
  };

  openChannelList = () => {
    useUIStateStore.getState().openChannelList();
  };

  closeChannelList = () => {
    useUIStateStore.getState().closeChannelList();
  };


  jumpToNote = (options: { channelId: string; messageId: string }) => {
    this.rxEventBus.requestJumpToMessage$.emit(options);
  };
}
