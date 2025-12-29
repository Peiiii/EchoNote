import type { KeyboardShortcutCommand } from '@tiptap/core'
import Heading from '@tiptap/extension-heading'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
const headingMarkdownRegex = /^(#{1,6})$/

const HeadingToggle = Heading.extend({
  addKeyboardShortcuts() {
    const parentShortcuts = (this.parent?.() ?? {}) as Record<string, KeyboardShortcutCommand>
    return {
      ...parentShortcuts,
      Space: ({ editor }) => {
        const parentSpace = parentShortcuts.Space
        const { state } = editor
        const { selection } = state

        if (!selection.empty) {
          return parentSpace ? parentSpace({ editor }) : false
        }

        const { $from } = selection
        const blockStart = $from.start()
        const textBefore = state.doc.textBetween(blockStart, selection.from, '\n', '\n')
        const match = headingMarkdownRegex.exec(textBefore)

        if (!match) {
          return parentSpace ? parentSpace({ editor }) : false
        }

        const level = match[1].length as HeadingLevel
        const from = selection.from - textBefore.length

        editor
          .chain()
          .focus()
          .deleteRange({ from, to: selection.from })
          .toggleHeading({ level })
          .run()

        return true
      },
    }
  },
})

export default HeadingToggle
