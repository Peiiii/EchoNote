import { Extension, type Editor } from '@tiptap/core'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'

export type SlashAction =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'bullet'
  | 'ordered'
  | 'task'
  | 'quote'
  | 'code'
  | 'icode'
  | 'hr'
  // table ops
  | 'table'
  | 'table-row-above'
  | 'table-row-below'
  | 'table-row-delete'
  | 'table-col-left'
  | 'table-col-right'
  | 'table-col-delete'
  | 'table-delete'
  | 'image'
  | 'link'
  | 'clear'

export type SlashOpenPayload = {
  query: string
  range: { from: number; to: number }
  clientRect: DOMRect | null
  invoke: (payload: { action: SlashAction }) => void
}

export interface SlashCommandOptions {
  char?: string
  onOpen: (payload: SlashOpenPayload) => void
  onUpdate: (payload: SlashOpenPayload) => void
  onClose: () => void
  onMoveIndex: (delta: number) => void
  onEnter: () => void
  onCommand: (editor: Editor, range: { from: number; to: number }, action: SlashAction) => void
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      char: '/',
      onOpen: () => {},
      onUpdate: () => {},
      onClose: () => {},
      onMoveIndex: () => {},
      onEnter: () => {},
      onCommand: () => {}
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    const opts = this.options

    const suggestion: SuggestionOptions = {
      editor,
      char: opts.char ?? '/',
      startOfLine: true,
      allowSpaces: true,
      command: ({ editor, range, props }) => {
        const action = (props as { action: SlashAction }).action
        if (action) {
          opts.onCommand(editor, range, action)
        }
      },
      render: () => {
        return {
          onStart: (props) => {
            const rect = props.clientRect?.() ?? null
            const invoke = (payload: { action: SlashAction }) => props.command(payload)
            opts.onOpen({ query: props.query ?? '', range: props.range, clientRect: rect, invoke })
          },
          onUpdate: (props) => {
            const rect = props.clientRect?.() ?? null
            const invoke = (payload: { action: SlashAction }) => props.command(payload)
            opts.onUpdate({ query: props.query ?? '', range: props.range, clientRect: rect, invoke })
          },
          onKeyDown: ({ event }) => {
            // Handle navigation and commit/cancel inside suggestion to avoid bubbling out
            if (event.key === 'ArrowDown') {
              opts.onMoveIndex(1)
              event.preventDefault()
              return true
            }
            if (event.key === 'ArrowUp') {
              opts.onMoveIndex(-1)
              event.preventDefault()
              return true
            }
            if (event.key === 'Enter') {
              opts.onEnter()
              event.preventDefault()
              return true
            }
            if (event.key === 'Escape') {
              opts.onClose()
              event.preventDefault()
              event.stopPropagation()
              return true
            }
            return false
          },
          onExit: () => {
            opts.onClose()
          }
        }
      }
    }

    return [Suggestion(suggestion)]
  }
})

export default SlashCommand
