import { CommonPresenter } from "@/common/services/common-presenter";


export class DesktopPresenter extends CommonPresenter {
  openAIAssistant(channelId: string) {
    this.rxEventBus.requestOpenAIAssistant$.emit({ channelId });
  }

  openThread(messageId: string) {
    this.rxEventBus.requestOpenThread$.emit({ messageId });
  }

  closeThread() {
    this.rxEventBus.requestCloseThread$.emit();
  }
  
  openSettings(channelId?: string) {
    this.rxEventBus.requestOpenSettings$.emit({ channelId });
  }

  jumpToMessage(channelId: string, messageId: string) {
    this.rxEventBus.requestJumpToMessage$.emit({ channelId, messageId });
  }
}