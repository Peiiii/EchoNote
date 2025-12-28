export type Unsubscribe = () => void;

/**
 * Opaque pagination cursor.
 * Each adapter is responsible for producing and consuming tokens.
 */
export type Cursor = string;

export type PaginatedResult<T> = {
  items: T[];
  nextCursor: Cursor | null;
};

