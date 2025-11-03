import { useUIStateStore } from "@/core/stores/ui-state.store";
import { ChannelManager } from "./services/channel-manager.service";
import { RxEventBusService } from "./services/rx-event-bus.service";
import { ThreadManager } from "./services/thread-manager.service";
import { ViewStateManager } from "./services/view-state-manager.service";
import { NoteManager } from "@/common/services/note-manager.service";
import { NoteEditManager } from "@/common/services/note-edit-manager";
import { ScrollManager } from "@/common/services/scroll.manager";

export class CommonPresenter {
  readonly rxEventBus = new RxEventBusService();
  readonly threadManager = new ThreadManager();
  readonly channelManager = new ChannelManager();
  readonly viewStateManager = new ViewStateManager();
  readonly noteManager = new NoteManager();
  readonly noteEditManager = new NoteEditManager();
  readonly scrollManager = new ScrollManager();
  
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

  openStudio = () => {
    useUIStateStore.getState().openStudio();
  };

  closeStudio = () => {
    useUIStateStore.getState().closeStudio();
  };

  jumpToNote = (options: { channelId: string; messageId: string }) => {
    this.rxEventBus.requestJumpToMessage$.emit(options);
  };
}
