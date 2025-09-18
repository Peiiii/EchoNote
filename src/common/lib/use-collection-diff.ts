import { useEffect, useRef } from "react";
import { CollectionDiff } from "./collection-diff";

export interface UseCollectionDiffParams<T> {
  items: T[];
  getId: (item: T) => string | null | undefined;
  hash: (item: T) => string;
  onAdd?: (item: T) => void | Promise<void>;
  onUpdate?: (item: T) => void | Promise<void>;
  resetKey?: unknown;
  debounceMs?: number;
}

export function useCollectionDiff<T>({ items, getId, hash, onAdd, onUpdate, resetKey, debounceMs }: UseCollectionDiffParams<T>) {
  const ref = useRef<CollectionDiff<T> | null>(null);

  useEffect(() => {
    ref.current = new CollectionDiff<T>({ getId, hash, onAdd, onUpdate, debounceMs });
    ref.current.update(items);
    return () => ref.current?.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, debounceMs]);

  useEffect(() => {
    ref.current?.configure({ getId, hash, onAdd, onUpdate });
  }, [getId, hash, onAdd, onUpdate]);

  useEffect(() => {
    ref.current?.update(items);
  }, [items]);
}
