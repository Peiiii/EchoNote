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

export function ExpandedComposer() {
  const presenter = useCommonPresenterContext();
  const { currentChannelId } = useNotesViewStore();
  const { message, handleMessageChange, handleSend } = useMessageInput();
  const setExpanded = useComposerStateStore(s => s.setExpanded);

  const currentChannel = useCurrentChannel();
  const channels = useNotesDataStore(s => s.channels);
  const setCurrentChannel = useNotesViewStore(s => s.setCurrentChannel);

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-background" data-component="expanded-composer">
      {/* Header - Left: Space selector + Send; Right: Collapse */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30">
        <div className="flex items-center gap-1.5 min-w-0">
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
              if (!message.trim() || !currentChannelId) return
              handleSend()
              setExpanded(false)
              presenter.rxEventBus.requestTimelineScrollToLatest$.emit()
            }}
            disabled={!message.trim()}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Send"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(false)}
            className="h-9 w-9"
            aria-label="Collapse"
            title="Collapse"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 min-h-0 p-3 overflow-hidden">
        <div className="w-full h-full" onKeyDown={(e) => {
          if (e.key === 'Escape') setExpanded(false)
          if (e.key === 'Enter' && (e as React.KeyboardEvent).shiftKey) {
            e.preventDefault()
            if (message.trim()) {
              handleSend()
              setExpanded(false)
              presenter.rxEventBus.requestTimelineScrollToLatest$.emit()
            }
          }
        }}>
          <RichEditorLite
            value={message}
            onChange={handleMessageChange}
            editable={true}
            placeholder={""}
            className="h-full"
            variant="frameless"
          />
        </div>
      </div>
    </div>
  )
}
