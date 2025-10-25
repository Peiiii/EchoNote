import { useCallback, useEffect, useRef } from "react";
import { collapseMakeElementAtVisibleTopOfContainer, getFloatOffset } from "../core/collapse-utils";
import {
  READ_MORE_DATA_ATTRS,
  READ_MORE_SELECTORS,
  getMessageIdFromElement,
} from "../core/dom-constants";
import { useReadMoreStore, selectShowFloatingCollapse } from "../store/read-more.store";

function findBottomCandidate(container: HTMLElement) {
  const nodes = Array.from(
    container.querySelectorAll(READ_MORE_SELECTORS.message)
  ) as HTMLElement[];
  if (!nodes.length) {
    return {
      id: null as string | null,
      inlineOverlap: false,
      visibleHeight: null as number | null,
    };
  }

  const cRect = container.getBoundingClientRect();
  let best: { id: string; distance: number; rect: DOMRect } | null = null;

  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    if (rect.bottom < cRect.top || rect.top > cRect.bottom) continue;
    const id = getMessageIdFromElement(node);
    if (!id) continue;
    const distance = Math.max(0, cRect.bottom - rect.bottom);
    if (!best || distance < best.distance) {
      best = { id, distance, rect };
    }
  }

  if (!best) {
    return {
      id: null as string | null,
      inlineOverlap: false,
      visibleHeight: null as number | null,
    };
  }

  const inlineBtn = container.querySelector(
    READ_MORE_SELECTORS.collapseInlineFor(best.id)
  ) as HTMLElement | null;
  const btnRect = inlineBtn?.getBoundingClientRect();
  const offset = getFloatOffset(container);
  const inlineOverlap = btnRect ? cRect.bottom - btnRect.bottom <= offset + 0.5 : false;
  const visibleHeight = Math.max(
    0,
    Math.min(cRect.bottom, best.rect.bottom) - Math.max(cRect.top, best.rect.top)
  );

  return { id: best.id, inlineOverlap, visibleHeight };
}

export function useGlobalCollapse(containerRef: React.RefObject<HTMLDivElement | null>) {
  const showFloatingCollapse = useReadMoreStore(selectShowFloatingCollapse);
  const requestCollapse = useReadMoreStore(useCallback(state => state.requestCollapse, []));
  const setActiveInfo = useReadMoreStore(useCallback(state => state.setActiveInfo, []));
  const registerLayoutSync = useReadMoreStore(useCallback(state => state.registerLayoutSync, []));

  const rafRef = useRef<number | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  // Defer active message recompute to next frame so multiple observer events coalesce.
  const scheduleUpdate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const { id, inlineOverlap, visibleHeight } = findBottomCandidate(container);
      setActiveInfo(id, inlineOverlap, visibleHeight);
    });
  }, [containerRef, setActiveInfo]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mutationObserverRef.current?.disconnect();
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mutationObserver = new MutationObserver(mutations => {
      const shouldSync = mutations.some(mutation => {
        if (mutation.type !== "childList") return false;
        const nodes = [...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)];
        return nodes.some(
          node => node instanceof HTMLElement && node.hasAttribute(READ_MORE_DATA_ATTRS.messageId)
        );
      });

      if (!shouldSync) return;
      scheduleUpdate();
    });
    mutationObserver.observe(container, { childList: true, subtree: true });
    mutationObserverRef.current = mutationObserver;

    scheduleUpdate();

    return () => {
      mutationObserver.disconnect();
    };
  }, [containerRef, scheduleUpdate]);

  useEffect(() => {
    registerLayoutSync(scheduleUpdate);
    return () => registerLayoutSync(null);
  }, [registerLayoutSync, scheduleUpdate]);

  useEffect(() => {
    window.addEventListener("resize", scheduleUpdate);
    return () => window.removeEventListener("resize", scheduleUpdate);
  }, [scheduleUpdate]);

  const handleScroll = useCallback(() => {
    scheduleUpdate();
  }, [scheduleUpdate]);

  const collapseCurrent = useCallback(() => {
    const state = useReadMoreStore.getState();
    const id = state.activeMessageId;
    const container = containerRef.current;
    if (!id || !container) return;
    const element = container.querySelector(
      READ_MORE_SELECTORS.messageById(id)
    ) as HTMLElement | null;
    if (!element) return;
    collapseMakeElementAtVisibleTopOfContainer({
      container,
      element,
      onCollapse: () => requestCollapse(id),
    });
  }, [containerRef, requestCollapse]);

  return { showFloatingCollapse, handleScroll, collapseCurrent };
}
