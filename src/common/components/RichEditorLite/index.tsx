import React, { useEffect, useMemo, useRef, useState } from 'react'
import './styles.css'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
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
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Table as TableIcon, CheckCircle, Strikethrough, Heading1, Heading2, Heading3, Minus, Braces, Languages, Undo2, Redo2, Eraser } from 'lucide-react'

import { htmlToMarkdown, markdownToHtml } from '@/common/utils/markdown-converter'
import SlashCommand, { type SlashOpenPayload, type SlashAction } from './extensions/slash-command'
import { lowlight } from 'lowlight/lib/common'

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
  const [slashMenu, setSlashMenu] = useState<{ open: boolean; x: number; y: number; range?: { from: number; to: number }; index: number; query: string; invoke?: (p: { action: SlashAction }) => void }>({ open: false, x: 0, y: 0, index: 0, query: '' })

  const editor = useEditor({
    extensions: [
      // Disable default codeBlock from StarterKit; we'll use Lowlight version
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
      }),
      Image.configure({ allowBase64: true }),
      Typography,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
      }),
      SlashCommand.configure({
        onOpen: (p: SlashOpenPayload) => {
          // Position relative to editor container
          const crect = containerRef.current?.getBoundingClientRect()
          let x = 8
          let y = 8
          if (p.clientRect && crect && containerRef.current) {
            x = p.clientRect.left - crect.left + containerRef.current.scrollLeft
            y = p.clientRect.bottom - crect.top + containerRef.current.scrollTop
          }
          setSlashMenu({ open: true, x, y, range: p.range, index: 0, query: p.query, invoke: p.invoke })
        },
        onUpdate: (p: SlashOpenPayload) => {
          const crect = containerRef.current?.getBoundingClientRect()
          let x = 8
          let y = 8
          if (p.clientRect && crect && containerRef.current) {
            x = p.clientRect.left - crect.left + containerRef.current.scrollLeft
            y = p.clientRect.bottom - crect.top + containerRef.current.scrollTop
          }
          setSlashMenu((s) => ({ ...(s || { open: true, index: 0 }), open: true, x, y, range: p.range, query: p.query, invoke: p.invoke }))
        },
        onClose: () => setSlashMenu({ open: false, x: 0, y: 0, index: 0, query: '' }),
        onMoveIndex: (delta: number) => setSlashMenu((s) => ({ ...s, index: Math.max(0, s.index + delta) })),
        onEnter: () => {
          const item = getSlashItems().at(slashMenu.index)
          if (item && slashMenu.invoke) {
            slashMenu.invoke({ action: (item as { id: SlashAction }).id })
          }
        },
        onCommand: (editor, range, action) => {
          // Replace trigger and apply action with official command flow
          const chain = editor.chain().focus().deleteRange(range).setTextSelection(range.from)
          switch (action) {
            case 'h1':
              chain.toggleHeading({ level: 1 }).run()
              break
            case 'h2':
              chain.toggleHeading({ level: 2 }).run()
              break
            case 'h3':
              chain.toggleHeading({ level: 3 }).run()
              break
            case 'bullet':
              chain.toggleBulletList().run()
              break
            case 'ordered':
              chain.toggleOrderedList().run()
              break
            case 'task':
              chain.toggleTaskList().run()
              break
            case 'quote':
              chain.toggleBlockquote().run()
              break
            case 'code': {
              const lang = window.prompt('Code block language (optional, e.g. ts, js, bash)')?.trim()
              if (lang) chain.toggleCodeBlock().updateAttributes('codeBlock', { language: lang }).run()
              else chain.toggleCodeBlock().run()
              break
            }
            case 'hr':
              chain.setHorizontalRule().run()
              break
            case 'table':
              chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              break
            case 'table-row-above':
              chain.addRowBefore().run()
              break
            case 'table-row-below':
              chain.addRowAfter().run()
              break
            case 'table-row-delete':
              chain.deleteRow().run()
              break
            case 'table-col-left':
              chain.addColumnBefore().run()
              break
            case 'table-col-right':
              chain.addColumnAfter().run()
              break
            case 'table-col-delete':
              chain.deleteColumn().run()
              break
            case 'table-delete':
              chain.deleteTable().run()
              break
            case 'image': {
              const url = window.prompt('Image URL')
              if (url) chain.setImage({ src: url }).run()
              else chain.run()
              break
            }
            case 'link': {
              const current = editor.getAttributes('link')?.href as string | undefined
              const href = window.prompt('Link URL', current || '')
              if (href === null) chain.run()
              else if (href.trim()) chain.setLink({ href: href.trim() }).run()
              else chain.unsetLink().run()
              break
            }
            default:
              chain.run()
          }
        }
      })
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
          const ed = editorRef.current
          if (!ed) return true

          // Shift+Tab → outdent (lift)
          if (event.shiftKey) {
            if (ed.can().liftListItem('taskItem')) {
              ed.chain().focus().liftListItem('taskItem').run()
              event.preventDefault()
              return true
            }
            if (ed.can().liftListItem('listItem')) {
              ed.chain().focus().liftListItem('listItem').run()
              event.preventDefault()
              return true
            }
            // Not handled - let browser default
            return false
          }

          // Tab → indent (sink)
          if (ed.can().sinkListItem('taskItem')) {
            ed.chain().focus().sinkListItem('taskItem').run()
            event.preventDefault()
            return true
          }
          if (ed.can().sinkListItem('listItem')) {
            ed.chain().focus().sinkListItem('listItem').run()
            event.preventDefault()
            return true
          }

          // Not in a list; try to detect "- ", "* ", "+ ", "1. " markers to convert to list
          const { $from } = ed.state.selection
          const parent = $from.parent
          const text = parent?.textContent ?? ''
          const bullet = /^\s*([-*+])\s+/.exec(text)
          const ordered = /^\s*(\d+)[.)]\s+/.exec(text)
          if (bullet) {
            ed.chain().focus().toggleBulletList().run()
            event.preventDefault()
            return true
          }
          if (ordered) {
            ed.chain().focus().toggleOrderedList().run()
            event.preventDefault()
            return true
          }

          // otherwise, allow default tab behavior
          return false
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
            const item = getSlashItems().at(slashMenu.index)
            if (item && slashMenu.invoke) {
              slashMenu.invoke({ action: item.id })
              return true
            }
          }
        }
        // '/' is handled by SlashCommand (Suggestion plugin)
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
          // Consume ESC locally to avoid parent (expanded editor) catching it
          event.preventDefault()
          event.stopPropagation()
          setSlashMenu({ open: false, x: 0, y: 0, index: 0, query: '' })
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
            setSlashMenu({ open: false, x: 0, y: 0, index: 0, query: '' })
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

  // execAndCleanupSlash no longer used (Suggestion handles command execution)

  const getSlashQuery = (): string => {
    const ed = editorRef.current
    if (!ed || !slashMenu.range) return ''
    return ed.state.doc.textBetween(slashMenu.range.from, slashMenu.range.to).trim().toLowerCase()
  }

  const allSlashItems: { label: string; id: SlashAction }[] = [
    { label: 'Heading 1', id: 'h1' },
    { label: 'Heading 2', id: 'h2' },
    { label: 'Heading 3', id: 'h3' },
    { label: 'Bulleted list', id: 'bullet' },
    { label: 'Numbered list', id: 'ordered' },
    { label: 'Task list', id: 'task' },
    { label: 'Quote', id: 'quote' },
    { label: 'Code block', id: 'code' },
    { label: 'Horizontal rule', id: 'hr' },
    { label: 'Table', id: 'table' },
    { label: 'Table: add row above', id: 'table-row-above' },
    { label: 'Table: add row below', id: 'table-row-below' },
    { label: 'Table: delete row', id: 'table-row-delete' },
    { label: 'Table: add column left', id: 'table-col-left' },
    { label: 'Table: add column right', id: 'table-col-right' },
    { label: 'Table: delete column', id: 'table-col-delete' },
    { label: 'Table: delete table', id: 'table-delete' },
    { label: 'Image…', id: 'image' },
    { label: 'Link…', id: 'link' },
  ]

  const getSlashItems = () => {
    const q = (slashMenu.query || getSlashQuery()).toLowerCase()
    if (!q) return allSlashItems
    return allSlashItems.filter((it) => it.label.toLowerCase().includes(q))
  }

  // No global capture needed; Suggestion plugin consumes ESC. This is left empty intentionally.

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
        <ToolbarButton active={isActive('strike')} disabled={!can(() => editor!.can().chain().focus().toggleStrike().run())} onClick={() => editor?.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton disabled={!can(() => editor!.can().chain().focus().undo().run())} onClick={() => editor?.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton disabled={!can(() => editor!.can().chain().focus().redo().run())} onClick={() => editor?.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Eraser className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton active={isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="w-4 h-4" />
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
        <ToolbarButton active={isActive('code')} disabled={!can(() => editor!.can().chain().focus().toggleCode().run())} onClick={() => editor?.chain().focus().toggleCode().run()}>
          <Braces className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton disabled={!isActive('codeBlock')} onClick={() => {
          const current = (editor?.getAttributes('codeBlock')?.language as string | undefined) || ''
          const next = window.prompt('Code block language (e.g. ts, js, json, bash). Leave empty to clear.', current)
          if (next === null) return
          const lang = next.trim()
          if (lang) editor?.chain().focus().updateAttributes('codeBlock', { language: lang }).run()
          else editor?.chain().focus().updateAttributes('codeBlock', { language: null }).run()
        }}>
          <Languages className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
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
                  onMouseDown={(e) => {
                    // Prevent editor blur so that commands can safely focus/dispatch
                    e.preventDefault()
                  }}
                  onClick={() => slashMenu.invoke?.({ action: it.id })}>
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
