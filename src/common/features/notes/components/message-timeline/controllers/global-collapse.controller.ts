import { RxEvent } from '@/common/lib/rx-event';
import { readMoreBus, type ReadMoreStatus } from '../read-more.bus';
import { computeFocusedId, collapseWithScrollTop } from '../utils/collapse-utils';

export class GlobalCollapseController {
  private focusedId: string | null = null;
  private statusMap: Record<string, { long: boolean; expanded: boolean; collapseInlineVisible?: boolean }> = {};
  private rafId: number | null = null;
  private unlisten: (() => void) | null = null;
  private inlineOverlap = false;

  changed$ = new RxEvent<void>();

  constructor(private containerRef: React.RefObject<HTMLDivElement | null>) {
    this.unlisten = readMoreBus.statusChanged$.listen((s: ReadMoreStatus) => {
      this.statusMap[s.messageId] = { long: s.long, expanded: s.expanded, collapseInlineVisible: s.collapseInlineVisible };
      this.changed$.emit();
    });
  }

  dispose() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.unlisten) this.unlisten();
    this.unlisten = null;
  }

  handleScroll() {
    const el = this.containerRef.current;
    if (!el) return;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      const nextId = computeFocusedId(el);
      let changed = false;
      if (nextId !== this.focusedId) {
        this.focusedId = nextId;
        changed = true;
      }
      if (nextId) {
        const inlineBtn = el.querySelector(`[data-collapse-inline-for="${nextId}"]`) as HTMLElement | null;
        if (inlineBtn) {
          const cRect = el.getBoundingClientRect();
          const bRect = inlineBtn.getBoundingClientRect();
          const dist = cRect.bottom - bRect.bottom;
          const offset = this.getFloatOffset();
          const overlapNow = dist <= offset + 0.5;
          if (overlapNow !== this.inlineOverlap) {
            this.inlineOverlap = overlapNow;
            changed = true;
          }
        } else if (this.inlineOverlap !== true) {
          this.inlineOverlap = true;
          changed = true;
        }
      }
      if (changed) this.changed$.emit();
    });
  }

  get showCollapse() {
    const id = this.focusedId;
    if (!id) return false;
    const s = this.statusMap[id];
    return !!(s && s.long && s.expanded && this.inlineOverlap);
  }

  private getFloatOffset(): number {
    const el = this.containerRef.current;
    if (!el) return 8;
    const cs = getComputedStyle(el);
    const v = cs.getPropertyValue('--collapse-float-offset');
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 8;
  }

  collapseCurrent() {
    const id = this.focusedId;
    const container = this.containerRef.current;
    if (!id || !container) return;
    const el = container.querySelector(`[data-message-id="${id}"]`) as HTMLElement | null;
    if (!el) return;
    const cRect = container.getBoundingClientRect();
    const rBefore = el.getBoundingClientRect();
    const topVisible = rBefore.top >= cRect.top;
    collapseWithScrollTop({
      container,
      element: el,
      topVisibleBefore: topVisible,
      onCollapse: () => readMoreBus.requestCollapse$.emit({ messageId: id }),
    });
  }
}
