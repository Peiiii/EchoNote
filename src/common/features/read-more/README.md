# Read‑More/Collapse System

This document explains the cross‑platform (mobile + desktop) Read‑More/Collapse behaviors, how the moving/float transition works, and how to integrate or tune it.

## UX Goals

- Long content is initially collapsed to a max height, with a subtle gradient + a centered pill button: “Read more”.
- After expansion, a centered pill “Collapse” appears. It normally scrolls with the note.
- When the inline Collapse pill would be covered near the bottom edge, it seamlessly switches to a floating pill near the bottom of the viewport. Scrolling back restores the inline pill.
- Floating and inline pills share the same low‑key design and do not distract from content.

## Files & Responsibilities

- `common/features/read-more/core/read-more.bus.ts`
  - `statusChanged$`: `{ messageId, long, expanded, collapseInlineVisible? }`
  - `requestCollapse$`: `{ messageId }`
- `common/features/read-more/core/collapse-utils.ts`
  - `computeFocusedId(container)`: picks the note closest to the vertical center.
  - `collapseWithScrollTop({ container, element, topVisibleBefore, onCollapse })`:
    - If top visible → just collapse; else collapse and align the top to container’s top.
- `common/features/read-more/store/read-more.store.ts`
  - Zustand store for shared status, focus info, collapse requests.
- `common/features/read-more/components/read-more-wrapper.tsx`
  - `ReadMoreBaseWrapper` – shared pill UI & state for both mobile/desktop wrappers.
- `common/features/read-more/hooks/use-global-collapse.ts`
  - Ultra‑thin hook: finds the message that intersects the bottom of the viewport, computes overlap, provides `{ showCollapse, handleScroll, collapseCurrent }`.
- `message-timeline.tsx`
  - Integrates the hook; renders floating Collapse pill at the bottom center; ensures pointer‑events are correct.
- Mobile
  - `mobile-thought-record/mobile-read-more-wrapper.tsx`: thin wrapper around `ReadMoreBaseWrapper`; sets defaults (maxHeight 600, clampMargin 24).
- Desktop
  - `desktop/thought-record/read-more-wrapper.tsx`: thin wrapper around `ReadMoreBaseWrapper`; defaults maxHeight 300.

## Visual Design

- Inline pills (Read more / Collapse)
  - `text-xs px-2.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm text-muted-foreground border-0 shadow-none`
- Floating Collapse pill
  - Button with secondary style: `h-8 rounded-full px-2.5 shadow-lg flex items-center gap-1`
  - Positioned bottom‑center:
    - `bottom: calc(env(safe-area-inset-bottom, 0px) + var(--collapse-float-offset, 8px))`
  - Container has `pointer-events-none`; button is wrapped in `pointer-events-auto`.

## Switching Logic (Inline ↔ Floating)

- Inline Collapse carries `data-collapse-inline-for="<messageId>"`.
- Controller computes per frame (rAF):
  - `dist = containerRect.bottom - inlineBtnRect.bottom`
  - Overlap if `dist <= offset + epsilon`, where `offset = getComputedStyle(container).getPropertyValue('--collapse-float-offset') || 8` and `epsilon ≈ 0.5`.
- `showCollapse = long && expanded && inlineOverlap === true`.

## Scroll Rules On Collapse

- Rule 1: If top edge is visible → just collapse.
- Rule 2: If top edge is not visible → collapse and align the element’s top to the container’s top.

## How To Integrate (New Container)

1. Render notes wrapped with `data-message-id="<id>"`.
2. Use `useGlobalCollapse(containerRef)` and wire:
   - `onScroll` → `handleScroll()` (after your own recordScrollPosition)
   - Floating pill → `{ showCollapse && <button onClick={collapseCurrent}>…</button> }`
3. In your per‑note long‑content wrapper:
   - Report bus events: `statusChanged$({ messageId, long, expanded })`.
   - When expanded and long → render inline Collapse with `data-collapse-inline-for`.
   - Optional IO signal is supported, but geometry switching is the source of truth.

## Tuning

- Collapsed height: Mobile wrapper `maxHeight` (default 600), Desktop wrapper `maxHeight` (default 300).
- Floating switch offset: CSS var `--collapse-float-offset` on the scroll container root (default 8px).
- Animation: Timeline uses `transition-all duration-150` for fade/translate.

## Edge Cases & Hardening

- Bottom unclickable strip: Avoid by using `pointer-events-none` on overlays; wrap interactive elements with `pointer-events-auto`.
- Hidden DOM eating clicks: Only render floating pill when `showCollapse`.
- Safe area: Floating bottom uses `env(safe-area-inset-bottom)`.

## QA Checklist

- Short note: No Read more; no Collapse.
- Long note collapsed: gradient + centered Read more pill.
- Expand → inline Collapse visible; scrolling down switches to floating when reaching bottom threshold; scrolling up restores inline.
- Collapse:
  - If top visible: content collapses, no scroll adjust.
  - If top not visible: collapses and aligns top to container’s top.
- Bottom area fully clickable; no invisible overlays.
- Desktop behavior matches mobile.

## Known Extensibility

- Translate labels: change pill text (e.g., "收起"/"展开").
- Unify thresholds by product config; expose via theme tokens or CSS vars.
- Programmatic collapse: fire `requestCollapse$({ messageId })`.
