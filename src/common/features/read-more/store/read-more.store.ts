import { create } from 'zustand'

/**
 * Status information for a single message's read-more state
 */
type StatusEntry = {
  /** Whether the message content is long enough to require collapse functionality */
  long: boolean
  /** Whether the message is currently expanded (showing full content) */
  expanded: boolean
  /** Whether the inline collapse button is visible (not overlapped by container edge) */
  inlineVisible?: boolean
}

/**
 * Global store for managing read-more/collapse state across all messages
 */
interface ReadMoreStore {
  /** Map of message IDs to their individual status information */
  statusMap: Record<string, StatusEntry>
  /** ID of the currently focused message (closest to container center) */
  focusedId: string | null
  /** Whether the inline collapse button of the focused message is overlapped */
  inlineOverlap: boolean
  /** ID of the message that has a pending collapse request */
  pendingCollapseId: string | null
  /** Updates the status information for a specific message */
  setStatus: (id: string, status: StatusEntry) => void
  /** Updates the focus information (which message is focused and if inline button is overlapped) */
  setFocusInfo: (focusedId: string | null, inlineOverlap: boolean) => void
  /** Requests a collapse operation for a specific message */
  requestCollapse: (id: string) => void
  /** Acknowledges that a collapse request has been processed */
  acknowledgeCollapse: () => void
}

/**
 * Zustand store instance for read-more/collapse state management
 * Provides centralized state management for all read-more components
 */
export const useReadMoreStore = create<ReadMoreStore>((set) => ({
  statusMap: {},
  focusedId: null,
  inlineOverlap: false,
  pendingCollapseId: null,
  setStatus: (id, status) => set((state) => ({
    statusMap: { ...state.statusMap, [id]: status },
  })),
  setFocusInfo: (focusedId, inlineOverlap) => set({ focusedId, inlineOverlap }),
  requestCollapse: (id) => set({ pendingCollapseId: id }),
  acknowledgeCollapse: () => set({ pendingCollapseId: null }),
}))

/**
 * Selector function to determine if the floating collapse button should be shown
 * @param state - The current store state
 * @returns True if floating collapse button should be visible
 */
export const selectShowFloatingCollapse = (state: ReadMoreStore) => {
  const id = state.focusedId
  if (!id) return false
  const entry = state.statusMap[id]
  if (!entry) return false
  return entry.long && entry.expanded && state.inlineOverlap
}

