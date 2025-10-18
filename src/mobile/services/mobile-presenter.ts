import { CommonPresenter } from "@/common/services/common-presenter";

export class MobilePresenter extends CommonPresenter {
  openAIAssistant({ channelId }: { channelId: string }) {
    this.rxEventBus.requestOpenAIAssistant$.emit({ channelId });
  }

  openThread({ messageId }: { messageId: string }) {
    this.rxEventBus.requestOpenThread$.emit({ messageId });
  }

  closeThread() {
    this.rxEventBus.requestCloseThread$.emit();
  }

  openSettings(options: { channelId?: string }) {
    this.rxEventBus.requestOpenSettings$.emit(options);
  }

  jumpToNote(options: { channelId: string; messageId: string }) {
    this.rxEventBus.requestJumpToMessage$.emit(options);
  }
}