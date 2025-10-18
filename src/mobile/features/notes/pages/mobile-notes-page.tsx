import { READ_MORE_SELECTORS } from "@/common/features/read-more/core/dom-constants";
import { useAutoSelectFirstChannel } from "@/common/hooks/use-auto-select-first-channel";
import { useHandleRxEvent } from "@/common/hooks/use-handle-rx-event";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesViewStore as notesViewStore } from "@/core/stores/notes-view.store";
import { MobileNotesLayout } from "@/mobile/features/notes/components/mobile-notes-layout";
import { MobileSidebarManager } from "@/mobile/features/notes/features/message-timeline";
import { useMobileNotesState } from "@/mobile/features/notes/hooks";
import { useMobilePresenterContext } from "@/mobile/hooks/use-mobile-presenter-context";

export function MobileNotesPage() {
  const presenter = useMobilePresenterContext();
  // Ensure a channel is selected once channels are available (first-login-friendly)
  useAutoSelectFirstChannel();
  const notesState = useMobileNotesState();
  const { jumpToNote } = useMobileJumpToNote();
  useHandleRxEvent(presenter.rxEventBus.requestJumpToMessage$, jumpToNote);

  // Get current channel name for header
  const currentChannel = notesState.channels.find(
    channel => channel.id === notesState.currentChannelId
  );

  return (
    <div className="h-full flex flex-col">
      {/* Main Chat Layout */}
      <MobileNotesLayout
        currentChannelName={currentChannel?.name}
        replyToMessageId={notesState.replyToMessageId}
        isAddingMessage={notesState.isAddingMessage}
        onSendMessage={notesState.handleSendMessage}
        onCancelReply={notesState.handleCancelReply}
        setReplyToMessageId={(messageId: string | null) => {
          if (messageId) {
            notesState.handleReply(messageId);
          }
        }}
      />

      {/* Sidebar Manager */}
      <MobileSidebarManager />
    </div>
  );
}

// Mobile jump-to-message orchestration (search result → switch channel → load more if needed → scroll → highlight)
function useMobileJumpToNote() {
  
  const jumpToNote =  ({ channelId, messageId }: { channelId: string; messageId: string }) => {
    const ensureHighlightStyle = () => {
      const id = "search-target-highlight-style";
      if (document.getElementById(id)) return;
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
    @keyframes search-target-pulse { 
      0% { background-color: rgba(250, 204, 21, 0.00); outline-color: rgba(245, 158, 11, 0.00); }
      20% { background-color: rgba(250, 204, 21, 0.32); outline-color: rgba(245, 158, 11, 0.95); }
      55% { background-color: rgba(250, 204, 21, 0.20); outline-color: rgba(245, 158, 11, 0.50); }
      100% { background-color: rgba(250, 204, 21, 0.08); outline-color: rgba(245, 158, 11, 0.00); }
    }
    .search-target-highlight { outline: 2px solid rgba(245, 158, 11, 0.9); background-color: rgba(250, 204, 21, 0.18); animation: search-target-pulse 1.5s ease-in-out 2; }
  `;
      document.head.appendChild(style);
    };

    const isInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= vh && rect.right <= vw;
    };

    const applyHighlightWhenVisible = (el: HTMLElement, duration = 3000) => {
      ensureHighlightStyle();
      let applied = false;
      const start = () => {
        if (applied) return;
        applied = true;
        el.classList.add("search-target-highlight");
        setTimeout(() => el.classList.remove("search-target-highlight"), duration);
      };
      if (isInViewport(el)) {
        start();
        return;
      }
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          entries => {
            const entry = entries.find(e => e.isIntersecting);
            if (entry) {
              start();
              observer.disconnect();
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(el);
        setTimeout(() => {
          if (!applied) {
            observer.disconnect();
            start();
          }
        }, 2000);
      } else {
        setTimeout(start, 300);
      }
    };

    (async () => {
      try {
        const { currentChannelId } = notesViewStore.getState();
        if (currentChannelId !== channelId) {
          notesViewStore.getState().setCurrentChannel(channelId);
          await new Promise(r => setTimeout(r, 160));
        }
        const selector = READ_MORE_SELECTORS.messageById(messageId);
        const tryScroll = () => {
          const el = document.querySelector(selector);
          if (el) {
            (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
            applyHighlightWhenVisible(el as HTMLElement, 3000);
            return true;
          }
          return false;
        };

        const MAX_WAIT_MS = 8000;
        const startedAt = Date.now();
        let loadAttempts = 0;
        channelMessageService.requestLoadInitialMessages$.next({ channelId });
        while (Date.now() - startedAt < MAX_WAIT_MS) {
          if (tryScroll()) return;
          const state = channelMessageService.dataContainer.get().messageByChannel[channelId];
          const canLoadMore = state?.hasMore && !state.loadingMore;
          if (canLoadMore && loadAttempts < 20) {
            loadAttempts += 1;
            await channelMessageService.loadMoreHistory({ channelId, messagesLimit: 20 });
            await new Promise<void>(resolve => {
              let settled = false;
              const unsub = channelMessageService.moreMessageLoadedEvent$.listen(ev => {
                if (ev.channelId === channelId && !settled) {
                  settled = true;
                  unsub();
                  resolve();
                }
              });
              setTimeout(() => {
                if (!settled) {
                  settled = true;
                  try {
                    unsub();
                  } catch (_e) {
                    /* ignore */
                  }
                  resolve();
                }
              }, 1600);
            });
            await new Promise(r => setTimeout(r, 60));
            continue;
          }
          await new Promise(r => setTimeout(r, 150));
        }
        console.warn("[Mobile JumpToMessage] not found within time budget", {
          channelId,
          messageId,
        });
      } finally {
        // noop
      }
    })();
  }
  return { jumpToNote };
}
