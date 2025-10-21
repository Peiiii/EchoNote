import { NoteEditManager } from "@/common/services/note-edit-manager";
import { NoteManager } from "@/common/services/note-manager.service";
import { NoteTimelineManager } from "@/common/services/note-timeline-manager.service";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { ChannelManager } from "./services/channel-manager.service";
import { RxEventBusService } from "./services/rx-event-bus.service";
import { ThreadManager } from "./services/thread-manager.service";
import { ViewStateManager } from "./services/view-state-manager.service";

export class CommonPresenter {
  readonly rxEventBus = new RxEventBusService();
  readonly threadManager = new ThreadManager();
  readonly channelManager = new ChannelManager();
  readonly viewStateManager = new ViewStateManager();
  readonly noteManager = new NoteManager();
  readonly noteTimelineManager = new NoteTimelineManager();
  readonly noteEditManager = new NoteEditManager();
  
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
