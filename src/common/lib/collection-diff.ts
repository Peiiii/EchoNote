export type IdGetter<T> = (item: T) => string | null | undefined;
export type Hasher<T> = (item: T) => string;

export interface CollectionDiffOptions<T> {
  getId: IdGetter<T>;
  hash: Hasher<T>;
  onAdd?: (item: T) => void | Promise<void>;
  onUpdate?: (item: T) => void | Promise<void>;
  debounceMs?: number;
}

export class CollectionDiff<T> {
  private map = new Map<string, string>();
  private init = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pending: T[] | null = null;
  private getId: IdGetter<T>;
  private hash: Hasher<T>;
  private onAdd?: (item: T) => void | Promise<void>;
  private onUpdate?: (item: T) => void | Promise<void>;
  private debounceMs: number;

  constructor(opts: CollectionDiffOptions<T>) {
    this.getId = opts.getId;
    this.hash = opts.hash;
    this.onAdd = opts.onAdd;
    this.onUpdate = opts.onUpdate;
    this.debounceMs = opts.debounceMs ?? 0;
  }

  configure(opts: Partial<CollectionDiffOptions<T>>) {
    if (opts.getId) this.getId = opts.getId;
    if (opts.hash) this.hash = opts.hash;
    if (opts.onAdd !== undefined) this.onAdd = opts.onAdd;
    if (opts.onUpdate !== undefined) this.onUpdate = opts.onUpdate;
    if (opts.debounceMs !== undefined) this.debounceMs = opts.debounceMs;
  }

  reset() {
    if (this.timer) clearTimeout(this.timer);
    this.map = new Map();
    this.init = false;
    this.pending = null;
  }

  update(items: T[]) {
    if (!this.init) {
      for (const it of items) {
        const id = this.getId(it);
        if (!id) continue;
        this.map.set(id, this.hash(it));
      }
      this.init = true;
      return;
    }
    this.pending = items;
    if (this.debounceMs > 0) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.flush(), this.debounceMs);
    } else {
      this.flush();
    }
  }

  private async flush() {
    if (!this.pending) return;
    const items = this.pending;
    this.pending = null;
    const adds: T[] = [];
    const updates: T[] = [];
    for (const it of items) {
      const id = this.getId(it);
      if (!id) continue;
      const h = this.hash(it);
      const prev = this.map.get(id);
      if (prev === undefined) adds.push(it);
      else if (prev !== h) updates.push(it);
    }
    for (const it of adds) {
      await this.onAdd?.(it);
      const id = this.getId(it);
      if (id) this.map.set(id, this.hash(it));
    }
    for (const it of updates) {
      await this.onUpdate?.(it);
      const id = this.getId(it);
      if (id) this.map.set(id, this.hash(it));
    }
  }
}
