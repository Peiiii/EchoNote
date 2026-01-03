import { ReactNode, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Channel } from "@/core/stores/notes-data.store";
import { ChannelHeader } from "./channel-header";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { useDesktopPresenterContext } from "@/desktop/hooks/use-desktop-presenter-context";

interface TimelineLayoutProps {
  content?: ReactNode;
  actions?: ReactNode;
  channel?: Channel;
  className?: string;
  // Optional overlay that covers the entire timeline area (header + content + actions)
  overlay?: ReactNode;
}

export const TimelineLayout = ({
  content,
  actions,
  channel,
  className = "",
  overlay,
}: TimelineLayoutProps) => {
  // Classic Focus Mode: when no right sidebar (AI Assistant/Thread) is open,
  // keep the reading width comfortable and centered.
  const { sideView } = useUIStateStore();
  const isFocusMode = !sideView;
  const outerPaddingClass = isFocusMode ? "px-4 sm:px-6 py-4" : "p-3";
  const contentWidthClass = isFocusMode ? "w-full max-w-[900px] mx-auto" : "w-full";
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative w-full h-full ${className}`} data-component="timeline-layout">
      <div ref={containerRef} className={`relative flex-1 flex flex-col h-full ${outerPaddingClass}`}>
        <div className={`flex-1 min-h-0 ${contentWidthClass}`}>
          <div className="relative flex flex-col h-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            {/* Channel Cover Header */}
            {channel && <AutoHideChannelHeader channel={channel} layoutRef={containerRef} />}

            {/* Timeline content area */}
            <div className="flex-1 flex flex-col min-h-0">
              {content}
            </div>

            {/* Actions area at bottom (composer) */}
            {actions && (
              <div className="shrink-0">
                {actions}
              </div>
            )}

            {/* Optional overlay to cover header + content + actions */}
            {overlay && (
              <div className="absolute inset-0 z-30">
                {overlay}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HIDE_SCROLL_THRESHOLD_PX = 120;
const SHOW_SCROLL_THRESHOLD_PX = 60;
const HOVER_REVEAL_DISTANCE_PX = 20;
const REVEAL_ON_SCROLL_UP_PX = 80;

interface AutoHideChannelHeaderProps {
  channel: Channel;
  layoutRef: React.RefObject<HTMLDivElement | null>;
}

const AutoHideChannelHeader = ({ channel, layoutRef }: AutoHideChannelHeaderProps) => {
  const presenter = useDesktopPresenterContext();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef(0);
  const upwardRevealDistanceRef = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [hoveringTopEdge, setHoveringTopEdge] = useState(false);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = (nextHeight: number) => {
      setHeaderHeight(prev => (Math.abs(prev - nextHeight) > 0.5 ? nextHeight : prev));
    };

    const initialHeight = node.getBoundingClientRect().height;
    updateHeight(initialHeight);

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (!entry) return;
      updateHeight(entry.contentRect.height);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollElementRef.current;
      if (!el) return;
      const scrollTop = el.scrollTop;
      const previousScrollTop = lastScrollTopRef.current;
      const delta = scrollTop - previousScrollTop;

      setHiddenByScroll(prevHidden => {
        let nextHidden = prevHidden;

        if (prevHidden) {
          if (scrollTop <= SHOW_SCROLL_THRESHOLD_PX) {
            upwardRevealDistanceRef.current = 0;
            nextHidden = false;
          } else if (delta < 0) {
            upwardRevealDistanceRef.current += -delta;
            if (upwardRevealDistanceRef.current >= REVEAL_ON_SCROLL_UP_PX) {
              nextHidden = false;
              upwardRevealDistanceRef.current = 0;
            }
          } else if (delta > 0) {
            upwardRevealDistanceRef.current = 0;
          }
        } else {
          if (scrollTop <= SHOW_SCROLL_THRESHOLD_PX) {
            nextHidden = false;
            upwardRevealDistanceRef.current = 0;
          } else if (delta > 0 && scrollTop > HIDE_SCROLL_THRESHOLD_PX) {
            nextHidden = true;
            upwardRevealDistanceRef.current = 0;
          } else if (delta !== 0) {
            upwardRevealDistanceRef.current = 0;
          }
        }

        return nextHidden;
      });

      lastScrollTopRef.current = scrollTop;
    };

    const detach = () => {
      if (scrollElementRef.current) {
        scrollElementRef.current.removeEventListener("scroll", handleScroll);
        scrollElementRef.current = null;
      }
    };

    const attach = (el: HTMLDivElement) => {
      if (scrollElementRef.current === el) {
        return;
      }
      detach();
      scrollElementRef.current = el;
      scrollElementRef.current.addEventListener("scroll", handleScroll, { passive: true });
      lastScrollTopRef.current = el.scrollTop;
      upwardRevealDistanceRef.current = 0;
      handleScroll();
    };

    let intervalId: number | null = null;

    const syncScrollElement = () => {
      const candidate = presenter.scrollManager.getScrollContainer();
      if (candidate && candidate instanceof HTMLDivElement) {
        attach(candidate);
      } else {
        detach();
      }
    };

    syncScrollElement();

    // Poll occasionally to catch ref changes from Virtuoso recreating its scroller.
    intervalId = window.setInterval(syncScrollElement, 500);

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
      detach();
    };
  }, [presenter]);

  useEffect(() => {
    if (!hiddenByScroll) {
      setHoveringTopEdge(false);
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      const container = layoutRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const withinX = event.clientX >= rect.left && event.clientX <= rect.right;
      const withinY = event.clientY >= rect.top && event.clientY <= rect.bottom;

      if (!withinX || !withinY) {
        setHoveringTopEdge(prev => (prev ? false : prev));
        return;
      }

      const distanceFromTop = event.clientY - rect.top;
      const shouldHover = distanceFromTop <= HOVER_REVEAL_DISTANCE_PX;

      setHoveringTopEdge(prev => (prev === shouldHover ? prev : shouldHover));
    };

    window.addEventListener("mousemove", handlePointerMove);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, [hiddenByScroll, layoutRef]);

  const shouldShowHeader = !hiddenByScroll || hoveringTopEdge;

  const style: CSSProperties = {
    transition: "transform 240ms ease, margin-bottom 240ms ease, opacity 180ms ease",
    transform: "translateY(0)",
    marginBottom: 0,
    opacity: 1,
    pointerEvents: "auto",
    willChange: "transform, margin-bottom, opacity",
  };

  if (!shouldShowHeader && headerHeight > 0) {
    style.transform = `translateY(-${headerHeight}px)`;
    style.marginBottom = `-${headerHeight}px`;
    style.opacity = 0;
    style.pointerEvents = "none";
  }

  return (
    <div ref={wrapperRef} className="relative z-20" style={style}>
      <div ref={contentRef}>
        <ChannelHeader channel={channel} />
      </div>
    </div>
  );
};
