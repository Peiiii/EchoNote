import { create } from 'zustand'

interface ComposerState {
  // Whether the timeline input composer is expanded to occupy the content area
  expanded: boolean

  // Draft content keyed by channel id so switching channels preserves drafts
  drafts: Record<string, string>

  // Actions
  setExpanded: (expanded: boolean) => void
  setDraft: (channelId: string, content: string) => void
  clearDraft: (channelId: string) => void
}

export const useComposerStateStore = create<ComposerState>()((set) => ({
  expanded: false,
  drafts: {},
  setExpanded: (expanded) => set({ expanded }),
  setDraft: (channelId, content) => set((state) => ({
    drafts: { ...state.drafts, [channelId]: content },
  })),
  clearDraft: (channelId) => set((state) => {
    const next = { ...state.drafts }
    delete next[channelId]
    return { drafts: next }
  }),
}))

