import React, { useEffect, useMemo, useRef, useState } from 'react'
import './styles.css'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import type { Editor } from '@tiptap/core'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Typography from '@tiptap/extension-typography'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Table as TableIcon, CheckCircle } from 'lucide-react'

import { htmlToMarkdown, markdownToHtml } from '@/common/utils/markdown-converter'

interface RichEditorLiteProps {
  value: string
  onChange?: (markdown: string) => void
  editable?: boolean
  placeholder?: string
  className?: string
}

function ToolbarButton({ disabled, active, onClick, children }: { disabled?: boolean; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex h-8 w-8 items-center justify-center rounded',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200 dark:hover:bg-slate-700',
        active ? 'bg-slate-200 dark:bg-slate-700' : 'bg-transparent',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export function RichEditorLite({ value, onChange, editable = true, placeholder = 'Write here...', className = '' }: RichEditorLiteProps) {
  const initialHtml = useMemo(() => markdownToHtml(value || ''), [value])
  const lastMarkdownRef = useRef<string>(value || '')
  const editorRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [slashMenu, setSlashMenu] = useState<{ open: boolean; x: number; y: number; from: number; index: number }>({ open: false, x: 0, y: 0, from: -1, index: 0 })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Underline,
      Link.configure({ openOnClick: true }),
      Image.configure({ allowBase64: true }),
      Typography,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: initialHtml,
    editable,
    editorProps: {
      attributes: {
        spellcheck: 'false',
        style: 'min-height: 240px; padding: 12px; outline: none;',
      },
      handlePaste(_view, evt): boolean {
        const items = Array.from(evt.clipboardData?.items || [])
        const img = items.find(i => i.type.startsWith('image/'))
        if (img) {
          const f = img.getAsFile()
          if (f) {
            const reader = new FileReader()
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                editorRef.current?.chain().focus().setImage({ src: reader.result }).run()
              }
            }
            reader.readAsDataURL(f)
            return true
          }
        }
        return false
      },
      handleKeyDown(_view, event): boolean {
        // Indent / outdent for task list and bullet/ordered list
        if (event.key === 'Tab') {
          event.preventDefault()
          const ed = editorRef.current
          if (!ed) return true

          // Shift+Tab → outdent (lift)
          if (event.shiftKey) {
            if (import.meta.env.DEV) {
              const canLiftTask = ed.can().liftListItem('taskItem')
              const canLiftList = ed.can().liftListItem('listItem')
              const ctx = {
                mode: 'outdent',
                canLiftTask,
                canLiftList,
                isTask: ed.isActive('taskList'),
                isBullet: ed.isActive('bulletList'),
                isOrdered: ed.isActive('orderedList'),
              }
              console.debug('[RichEditorLite][Tab]', ctx)
            }
            if (ed.can().liftListItem('taskItem')) {
              ed.chain().focus().liftListItem('taskItem').run()
              return true
            }
            if (ed.can().liftListItem('listItem')) {
              ed.chain().focus().liftListItem('listItem').run()
              return true
            }
            return true
          }

          // Tab → indent (sink)
          if (import.meta.env.DEV) {
            const canSinkTask = ed.can().sinkListItem('taskItem')
            const canSinkList = ed.can().sinkListItem('listItem')
            const ctx = {
              mode: 'indent',
              canSinkTask,
              canSinkList,
              isTask: ed.isActive('taskList'),
              isBullet: ed.isActive('bulletList'),
              isOrdered: ed.isActive('orderedList'),
            }
            console.debug('[RichEditorLite][Tab]', ctx)
          }
          if (ed.can().sinkListItem('taskItem')) {
            ed.chain().focus().sinkListItem('taskItem').run()
            return true
          }
          if (ed.can().sinkListItem('listItem')) {
            ed.chain().focus().sinkListItem('listItem').run()
            return true
          }
          return true
        }
        // Slash menu keyboard UX
        if (slashMenu.open) {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setSlashMenu((m) => ({ ...m, index: m.index + 1 }))
            return true
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            setSlashMenu((m) => ({ ...m, index: Math.max(0, m.index - 1) }))
            return true
          }
          if (event.key === 'Enter') {
            event.preventDefault()
            // run selected item if present
            const runSelected = getSlashItems().at(slashMenu.index)
            if (runSelected) {
              runSelected.onSelect()
              return true
            }
          }
        }
        // Open slash menu and anchor to caret
        if (event.key === '/') {
          const pos = editorRef.current?.state.selection.from ?? 0
          setTimeout(() => {
            // After slash inserted, caret moves forward by 1
            const coords = editorRef.current?.view.coordsAtPos((editorRef.current?.state.selection.from ?? pos) as number)
            const crect = containerRef.current?.getBoundingClientRect()
            if (coords && crect && containerRef.current) {
              const x = coords.left - crect.left + containerRef.current.scrollLeft
              const y = coords.top - crect.top + containerRef.current.scrollTop + 20
              setSlashMenu({ open: true, x, y, from: pos, index: 0 })
            } else {
              setSlashMenu({ open: true, x: 8, y: 8, from: pos, index: 0 })
            }
          }, 0)
          return false
        }
        // Link edit hotkey
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault()
          const current = editorRef.current?.getAttributes('link')?.href as string | undefined
          const href = window.prompt('Link URL', current || '')
          if (href === null) return true
          if (href.trim()) {
            editorRef.current?.chain().focus().setLink({ href: href.trim() }).run()
          } else {
            editorRef.current?.chain().focus().unsetLink().run()
          }
          return true
        }
        if (event.key === 'Escape' && slashMenu.open) {
          setSlashMenu({ open: false, x: 0, y: 0, from: -1, index: 0 })
          return true
        }
        return false
      },
      handleDOMEvents: {
        dblclick: (_view: unknown, event: Event) => {
          const target = event.target as HTMLElement
          if (target && target.tagName === 'IMG') {
            const newUrl = window.prompt('Image URL (leave empty to remove)', (target as HTMLImageElement).src || '')
            if (newUrl === null) return true
            if (!newUrl.trim()) {
              editorRef.current?.chain().focus().deleteSelection().run()
              return true
            }
            editorRef.current?.chain().focus().setImage({ src: newUrl.trim(), alt: (target as HTMLImageElement).alt }).run()
            return true
          }
          return false
        },
        click: (_view: unknown, event: Event) => {
          const target = event.target as HTMLElement
          // Close slash menu on any click outside
          if (slashMenu.open && !containerRef.current?.contains(target)) {
            setSlashMenu({ open: false, x: 0, y: 0, from: -1, index: 0 })
          }
          return false
        },
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor
    },
    onUpdate({ editor }) {
      const html = editor.getHTML()
      const md = htmlToMarkdown(html)
      if (md !== lastMarkdownRef.current) {
        lastMarkdownRef.current = md
        onChange?.(md)
      }
    },
  })

  // Sync external value changes into editor
  useEffect(() => {
    if (!editor) return
    if (value !== lastMarkdownRef.current) {
      lastMarkdownRef.current = value
      const html = markdownToHtml(value || '')
      editor.commands.setContent(html)
    }
  }, [value, editor])

  // Keep editable prop in sync
  useEffect(() => {
    if (editor) editor.setEditable(editable)
  }, [editable, editor])

  const isActive = (name: string, attrs?: Record<string, unknown>) => editor?.isActive(name, attrs) ?? false
  const can = (fn: () => boolean) => (editor ? fn() : false)

  const execAndCleanupSlash = (fn: () => void) => {
    const ed = editorRef.current
    if (ed && slashMenu.from >= 0) {
      const tr = ed.state.tr.delete(slashMenu.from, slashMenu.from + 1)
      ed.view.dispatch(tr)
    }
    fn()
    setSlashMenu({ open: false, x: 0, y: 0, from: -1, index: 0 })
  }

  const getSlashQuery = (): string => {
    const ed = editorRef.current
    if (!ed || slashMenu.from < 0) return ''
    const cur = ed.state.selection.from
    const from = Math.min(slashMenu.from + 1, cur)
    const to = Math.max(slashMenu.from + 1, cur)
    return ed.state.doc.textBetween(from, to).trim().toLowerCase()
  }

  const allSlashItems = [
    { label: 'Heading 1', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().toggleHeading({ level: 1 }).run()) },
    { label: 'Heading 2', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().toggleHeading({ level: 2 }).run()) },
    { label: 'Bulleted list', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().toggleBulletList().run()) },
    { label: 'Numbered list', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().toggleOrderedList().run()) },
    { label: 'Task list', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().toggleTaskList().run()) },
    { label: 'Quote', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().toggleBlockquote().run()) },
    { label: 'Code block', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().toggleCodeBlock().run()) },
    { label: 'Table', onSelect: () => execAndCleanupSlash(() => editorRef.current?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()) },
    { label: 'Image…', onSelect: () => execAndCleanupSlash(() => { const url = window.prompt('Image URL'); if (url) editorRef.current?.chain().focus().setImage({ src: url }).run() }) },
    { label: 'Link…', onSelect: () => execAndCleanupSlash(() => { const current = editorRef.current?.getAttributes('link')?.href as string | undefined; const href = window.prompt('Link URL', current || ''); if (href === null) return; if (href.trim()) editorRef.current?.chain().focus().setLink({ href: href.trim() }).run(); else editorRef.current?.chain().focus().unsetLink().run(); }) },
  ] as const

  const getSlashItems = () => {
    const q = getSlashQuery()
    if (!q) return allSlashItems
    return allSlashItems.filter((it) => it.label.toLowerCase().includes(q))
  }

  return (
    <div className={["border rounded-md bg-background flex flex-col h-full", className].join(' ')}>
      <div className="flex items-center gap-1 px-2 py-1 border-b shrink-0">
        <ToolbarButton active={isActive('bold')} disabled={!can(() => editor!.can().chain().focus().toggleBold().run())} onClick={() => editor?.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('italic')} disabled={!can(() => editor!.can().chain().focus().toggleItalic().run())} onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('underline')} disabled={!can(() => editor!.can().chain().focus().toggleUnderline().run())} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton active={isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('taskList')} onClick={() => editor?.chain().focus().toggleTaskList().run()}>
          <CheckCircle className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton active={isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton onClick={() => {
          const href = window.prompt('Link URL')
          if (href) editor?.chain().focus().setLink({ href }).run()
        }}>
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {
          const url = window.prompt('Image URL or base64')
          if (url) editor?.chain().focus().setImage({ src: url }).run()
        }}>
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>
      <div ref={containerRef} className="relative min-h-0 flex-1 overflow-y-auto p-3">
        {!editor?.getText() && (
          <div className="pointer-events-none absolute left-3 top-3 text-sm text-slate-400 select-none">{placeholder}</div>
        )}
        <EditorContent editor={editor} className="tiptap prose dark:prose-invert max-w-none min-h-full outline-none focus:outline-none" />
        {slashMenu.open && (
          <div
            style={{ position: 'absolute', left: slashMenu.x, top: slashMenu.y, zIndex: 1000, minWidth: 240 }}
            className="rounded-md border bg-white dark:bg-slate-800 shadow-lg p-1 text-sm">
            <div className="px-2 py-1.5 text-xs text-slate-500">Quick insert</div>
            <div className="max-h-64 overflow-auto">
              {getSlashItems().map((it, idx) => (
                <button
                  key={it.label}
                  className={["w-full text-left px-2 py-1 rounded flex items-center gap-2",
                    idx === slashMenu.index ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-700"].join(' ')}
                  onClick={() => it.onSelect()}>
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RichEditorLite
