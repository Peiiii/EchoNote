import { Button } from "@/common/components/ui/button";
import { RichEditorLite } from "@/common/components/RichEditorLite";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useComposerStateStore } from "@/core/stores/composer-state.store";
import { useMessageInput } from "../message-input/hooks/use-message-input";
import { Minimize2, Send } from "lucide-react";
import { MobileChannelDropdownSelector } from "@/mobile/features/notes/features/channel-management/components/mobile-channel-dropdown-selector";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { useTranslation } from "react-i18next";
import { ExpandedSurface } from "./expanded-surface";

export function ExpandedComposer() {
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  const { currentChannelId } = useNotesViewStore();
  const { message, handleMessageChange, handleSend } = useMessageInput();
  const setExpanded = useComposerStateStore(s => s.setExpanded);

  const currentChannel = useCurrentChannel();
  const channels = useNotesDataStore(s => s.channels);
  const setCurrentChannel = useNotesViewStore(s => s.setCurrentChannel);

  return (
    <ExpandedSurface
      className="w-full h-full"
      headerLeft={
        <>
          {currentChannel && (
            <MobileChannelDropdownSelector
              currentChannel={currentChannel}
              channels={channels}
              onChannelSelect={setCurrentChannel}
              className="max-w-[240px]"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (!message.trim() || !currentChannelId) return;
              handleSend();
              setExpanded(false);
              presenter.rxEventBus.requestTimelineScrollToLatest$.emit();
            }}
            disabled={!message.trim()}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label={t("common.send")}
            title={t("common.send")}
          >
            <Send className="w-4 h-4" />
          </Button>
        </>
      }
      headerRight={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(false)}
          className="h-9 w-9"
          aria-label={t("common.collapse")}
          title={t("common.collapse")}
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      }
      onKeyDown={e => {
        if (e.key === "Escape") setExpanded(false);
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault();
          if (!message.trim() || !currentChannelId) return;
          handleSend();
          setExpanded(false);
          presenter.rxEventBus.requestTimelineScrollToLatest$.emit();
        }
      }}
    >
      <RichEditorLite
        value={message}
        onChange={handleMessageChange}
        editable={true}
        placeholder={""}
        className="h-full"
        variant="frameless"
      />
    </ExpandedSurface>
  )
}
