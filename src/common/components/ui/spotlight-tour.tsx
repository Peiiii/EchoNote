import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/common/components/ui/button";
import { X } from "lucide-react";

type Target = string | HTMLElement | null | undefined;

function resolveTarget(target: Target): HTMLElement | null {
  if (!target) return null;
  if (typeof target !== "string") return target;
  return document.querySelector(target) as HTMLElement | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function SpotlightTour(props: {
  open: boolean;
  target: Target;
  title: string;
  description?: string;
  dismissLabel?: string;
  actionLabel?: string;
  onDismiss: () => void;
  onAction?: () => void;
  onTargetClick?: () => void;
}) {
  const { open, target, title, description, onDismiss, onTargetClick, onAction } = props;
  const dismissLabel = props.dismissLabel ?? "Skip";
  const actionLabel = props.actionLabel ?? "";

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 320, height: 140 });

  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setTargetEl(null);
      return;
    }

    let raf = 0;
    const tick = () => {
      const el = resolveTarget(target);
      if (el) {
        setTargetEl(el);
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };
    tick();
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [open, target]);

  useLayoutEffect(() => {
    if (!open) return;
    if (!targetEl) return;

    const update = () => {
      try {
        setTargetRect(targetEl.getBoundingClientRect());
      } catch {
        setTargetRect(null);
      }
    };
    update();

    const onResize = () => update();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    const ro = new ResizeObserver(() => update());
    ro.observe(targetEl);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      ro.disconnect();
    };
  }, [open, targetEl]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = tooltipRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setTooltipSize({ width: rect.width, height: rect.height });
    }
  }, [open, title, description]);

  useEffect(() => {
    if (!open) return;
    if (!targetEl) return;
    if (!onTargetClick) return;

    const handle = () => onTargetClick();
    targetEl.addEventListener("click", handle, true);
    return () => {
      targetEl.removeEventListener("click", handle, true);
    };
  }, [open, targetEl, onTargetClick]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onDismiss]);

  if (!open) return null;
  if (!targetEl || !targetRect) return null;

  const padding = 10;
  const hole = {
    left: clamp(targetRect.left - padding, 0, window.innerWidth),
    top: clamp(targetRect.top - padding, 0, window.innerHeight),
    right: clamp(targetRect.right + padding, 0, window.innerWidth),
    bottom: clamp(targetRect.bottom + padding, 0, window.innerHeight),
  };

  const overlayStyle = {
    background: "rgba(0,0,0,0.55)",
  } as const;

  const gap = 12;
  const preferBelow = hole.bottom + gap + tooltipSize.height < window.innerHeight - 12;
  const tooltipTop = preferBelow
    ? clamp(hole.bottom + gap, 12, window.innerHeight - tooltipSize.height - 12)
    : clamp(hole.top - gap - tooltipSize.height, 12, window.innerHeight - tooltipSize.height - 12);
  const tooltipLeft = clamp(
    (hole.left + hole.right) / 2 - tooltipSize.width / 2,
    12,
    window.innerWidth - tooltipSize.width - 12
  );

  const node = (
    <div className="fixed inset-0 z-[9999]">
      {/* 4 rectangles around the target to keep the target clickable */}
      <div
        className="fixed left-0 right-0 top-0 pointer-events-auto"
        style={{ ...overlayStyle, height: hole.top }}
        onMouseDown={e => e.preventDefault()}
      />
      <div
        className="fixed left-0 pointer-events-auto"
        style={{ ...overlayStyle, top: hole.top, height: hole.bottom - hole.top, width: hole.left }}
        onMouseDown={e => e.preventDefault()}
      />
      <div
        className="fixed right-0 pointer-events-auto"
        style={{
          ...overlayStyle,
          top: hole.top,
          height: hole.bottom - hole.top,
          width: window.innerWidth - hole.right,
        }}
        onMouseDown={e => e.preventDefault()}
      />
      <div
        className="fixed left-0 right-0 bottom-0 pointer-events-auto"
        style={{ ...overlayStyle, top: hole.bottom }}
        onMouseDown={e => e.preventDefault()}
      />

      {/* Highlight outline */}
      <div
        className="fixed pointer-events-none rounded-xl ring-2 ring-white/90"
        style={{
          left: hole.left,
          top: hole.top,
          width: hole.right - hole.left,
          height: hole.bottom - hole.top,
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed pointer-events-auto w-[320px] max-w-[calc(100vw-24px)] rounded-xl border bg-background shadow-xl"
        style={{ left: tooltipLeft, top: tooltipTop }}
      >
        <div className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            {description ? (
              <div className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</div>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={onDismiss}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-end gap-2 px-4 pb-4">
          {onAction && actionLabel ? (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            {dismissLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
