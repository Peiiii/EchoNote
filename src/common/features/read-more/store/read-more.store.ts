import { create } from 'zustand'

/**
 * Status information for a single message's read-more state
 */
type StatusEntry = {
  /** Whether the message content is long enough to require collapse functionality */
  long: boolean
  /** Whether the message is currently expanded (showing full content) */
  expanded: boolean
  /** Visible height threshold at which collapsing stops being useful */
  collapseThreshold: number
}

/**
 * Global store for managing read-more/collapse state across all messages
 */
interface ReadMoreStore {
  /** Map of message IDs to their individual status information */
  statusMap: Record<string, StatusEntry>
  /** ID of the message that currently sits at the bottom edge of the viewport */
  activeMessageId: string | null
  /** Whether the inline collapse button of the active message is overlapped */
  inlineOverlap: boolean
  /** Visible height (within viewport) of the active message */
  activeVisibleHeight: number | null
  /** ID of the message that has a pending collapse request */
  pendingCollapseId: string | null
  /** Latest layout sync callback registered by collapse hook */
  layoutSync: (() => void) | null
  /** Whether the next auto-scroll should be suppressed */
  autoScrollSuppressed: boolean
  /** Updates the status information for a specific message */
  setStatus: (id: string, status: StatusEntry) => void
  /** Updates which message is controlling the floating collapse button */
  setActiveInfo: (
    messageId: string | null,
    inlineOverlap: boolean,
    visibleHeight: number | null
  ) => void
  /** Requests a collapse operation for a specific message */
  requestCollapse: (id: string) => void
  /** Acknowledges that a collapse request has been processed */
  acknowledgeCollapse: () => void
  /** Registers latest layout sync callback */
  registerLayoutSync: (cb: (() => void) | null) => void
  /** Notifies that read-more layout may have changed */
  notifyLayoutChange: () => void
  /** Suppresses the next auto-scroll triggered by sticky mode */
  suppressAutoScrollOnce: () => void
  /** Consumes suppression flag, returning true if suppression was active */
  consumeAutoScrollSuppression: () => boolean
}

/**
 * Zustand store instance for read-more/collapse state management
 * Provides centralized state management for all read-more components
 */
export const useReadMoreStore = create<ReadMoreStore>((set, get) => ({
  statusMap: {},
  activeMessageId: null,
  inlineOverlap: false,
  activeVisibleHeight: null,
  pendingCollapseId: null,
  layoutSync: null,
  autoScrollSuppressed: false,
  setStatus: (id, status) => set((state) => ({
    statusMap: { ...state.statusMap, [id]: status },
  })),
  setActiveInfo: (messageId, inlineOverlap, visibleHeight) =>
    set({
      activeMessageId: messageId,
      inlineOverlap,
      activeVisibleHeight: visibleHeight,
    }),
  requestCollapse: (id) => set({ pendingCollapseId: id }),
  acknowledgeCollapse: () => set({ pendingCollapseId: null }),
  registerLayoutSync: (cb) => set({ layoutSync: cb }),
  notifyLayoutChange: () => {
    const cb = get().layoutSync
    cb?.()
  },
  suppressAutoScrollOnce: () => set({ autoScrollSuppressed: true }),
  consumeAutoScrollSuppression: () => {
    const suppressed = get().autoScrollSuppressed
    if (suppressed) {
      set({ autoScrollSuppressed: false })
    }
    return suppressed
  },
}))

/**
 * Selector function to determine if the floating collapse button should be shown
 * @param state - The current store state
 * @returns True if floating collapse button should be visible
 */
export const selectShowFloatingCollapse = (state: ReadMoreStore) => {
  const id = state.activeMessageId
  if (!id) return false
  const entry = state.statusMap[id]
  if (!entry) return false
  if (!entry.long || !entry.expanded) return false
  if (!state.inlineOverlap) return false
  if (entry.collapseThreshold <= 0) return true
  if (state.activeVisibleHeight == null) return true
  return state.activeVisibleHeight > entry.collapseThreshold + 1
}
