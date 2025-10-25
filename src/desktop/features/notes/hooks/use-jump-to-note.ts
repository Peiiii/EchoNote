import { READ_MORE_SELECTORS } from "@/common/features/read-more/core/dom-constants";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { channelMessageService } from "@/core/services/channel-message.service";
import {
    useNotesViewStore as notesViewStore
} from "@/core/stores/notes-view.store";
import { useRef } from "react";

export const useJumpToNote = () => {
  const presenter = useCommonPresenterContext();
  const jumpingRef = useRef(false);
  const jumpToNote = ({ channelId, messageId }: { channelId: string; messageId: string }) => {
    if (jumpingRef.current) return; // simple throttle to avoid rapid repeated jumps
    jumpingRef.current = true;
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
              .search-target-highlight {
                outline: 2px solid rgba(245, 158, 11, 0.9); /* amber-500 */
                background-color: rgba(250, 204, 21, 0.18); /* amber-300 @ ~18% */
                animation: search-target-pulse 1.5s ease-in-out 2;
              }
            `;
      document.head.appendChild(style);
    };

    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= vh && rect.right <= vw;
    };

    // Apply highlight after the element becomes visible in viewport
    const applyHighlightWhenVisible = (el: HTMLElement, duration = 1200) => {
      ensureHighlightStyle();
      let applied = false;
      const start = () => {
        if (applied) return;
        applied = true;
        el.classList.add("search-target-highlight");
        setTimeout(() => el.classList.remove("search-target-highlight"), duration);
      };

      if (isElementInViewport(el)) {
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
        // Fallback in case observer never fires (e.g., display changes)
        setTimeout(() => {
          if (!applied) {
            observer.disconnect();
            start();
          }
        }, 2000);
      } else {
        // Fallback: delay a bit and apply
        setTimeout(start, 300);
      }
    };

    (async () => {
      try {
        const { currentChannelId } = notesViewStore.getState();
        if (currentChannelId !== channelId) {
          notesViewStore.getState().setCurrentChannel(channelId);
          await new Promise(r => setTimeout(r, 140)); // let UI mount
        }

        const selector = READ_MORE_SELECTORS.messageById(messageId);
        const applyScrollAndHighlight = (el: HTMLElement, alreadyScrolled?: boolean) => {
          if (!alreadyScrolled) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          applyHighlightWhenVisible(el, 3000);
        };
        const tryScroll = async () => {
          const existing = document.querySelector(selector) as HTMLElement | null;
          if (existing) {
            applyScrollAndHighlight(existing);
            return true;
          }

          const virtualApi = presenter.scrollManager.getTimelineVirtualScrollApi();
          const didVirtualScroll =
            virtualApi?.scrollToMessageId(messageId, { align: "start", behavior: "smooth" }) ?? false;

          if (didVirtualScroll) {
            await wait(120);
            const afterVirtual = document.querySelector(selector) as HTMLElement | null;
            if (afterVirtual) {
              applyScrollAndHighlight(afterVirtual, true);
              return true;
            }
          }
          return false;
        };

        const MAX_WAIT_MS = 8000;
        const startedAt = Date.now();
        let loadMoreAttempts = 0;

        // Ensure initial messages requested for this channel
        channelMessageService.requestLoadInitialMessages$.next({ channelId });

        // Loop: try find → load more if possible → wait → retry
        while (Date.now() - startedAt < MAX_WAIT_MS) {
          if (await tryScroll()) return;

          const state = channelMessageService.dataContainer.get().messageByChannel[channelId];
          const canLoadMore = state?.hasMore && !state.loadingMore;
          if (canLoadMore && loadMoreAttempts < 25) {
            loadMoreAttempts += 1;
            await channelMessageService.loadMoreHistory({ channelId, messagesLimit: 30 });
            // Wait until this channel reports new messages loaded
            await new Promise<void>(resolve => {
              let settled = false;
              const unsub = channelMessageService.moreMessageLoadedEvent$.listen(ev => {
                if (ev.channelId === channelId && !settled) {
                  settled = true;
                  unsub();
                  resolve();
                }
              });
              // Safety timeout in case the event never fires
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
            // small layout stabilization
            await new Promise(r => setTimeout(r, 70));
            continue;
          }

          // Nothing to load, just poll a bit
          await new Promise(r => setTimeout(r, 160));
        }

        console.warn("[JumpToMessage] not found within time budget", { channelId, messageId });
      } finally {
        setTimeout(() => {
          jumpingRef.current = false;
        }, 200); // small cooldown
      }
    })();
  };
  return { jumpToNote };
};
