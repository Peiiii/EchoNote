import { v4 as uuidv4 } from "uuid";

const GUEST_ID_STORAGE_KEY = "echonote-guest-id";
export const GUEST_USER_PREFIX = "guest:";

export function isGuestUserId(userId: string): boolean {
  return userId.startsWith(GUEST_USER_PREFIX);
}

export function getExistingGuestUserId(): string | null {
  const existing = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  if (!existing || !existing.startsWith(GUEST_USER_PREFIX)) return null;
  return existing;
}

export function hasGuestWorkspace(): boolean {
  return getExistingGuestUserId() !== null;
}

export function getOrCreateGuestUserId(): string {
  const existing = getExistingGuestUserId();
  if (existing) return existing;
  const next = `${GUEST_USER_PREFIX}${uuidv4()}`;
  localStorage.setItem(GUEST_ID_STORAGE_KEY, next);
  return next;
}
