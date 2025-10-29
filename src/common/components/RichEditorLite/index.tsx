import React, { useEffect, useMemo, useRef, useState } from 'react'
import './styles.css'
import { EditorContent, useEditor } from '@tiptap/react'
import BubbleMenuExt, { type BubbleMenuOptions } from '@tiptap/extension-bubble-menu'
import type { Extension as TiptapExtension } from '@tiptap/core'
import { createPortal } from 'react-dom'
import { StarterKit } from '@tiptap/starter-kit'
// Custom code block with actions (language switcher, copy)
import CodeBlockWithActions from './extensions/codeblock-with-actions'
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
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Table as TableIcon, CheckCircle, Strikethrough, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Minus, Braces, Undo2, Redo2, Eraser, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

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
  // Create bubble menu element before editor initialization so the extension can mount.
  const bubbleEl = useMemo<HTMLElement>(() => {
    return document.createElement('div')
  }, [])
  const initialHtml = useMemo(() => markdownToHtml(value || ''), [value])
  const lastMarkdownRef = useRef<string>(value || '')
  const editorRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [slashMenu, setSlashMenu] = useState<{ open: boolean; x: number; y: number; range?: { from: number; to: number }; index: number; query: string; invoke?: (p: { action: SlashAction }) => void }>({ open: false, x: 0, y: 0, index: 0, query: '' })
  const [tableMenu, setTableMenu] = useState<{ open: boolean; x: number; y: number }>({ open: false, x: 0, y: 0 })

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
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockWithActions.configure({
        lowlight,
        defaultLanguage: null,
      }),
      // Official BubbleMenu extension (Tiptap)
      BubbleMenuExt.configure({
        element: bubbleEl,
        options: { placement: 'top' },
        // initial rule; will be kept in sync via effect below
        shouldShow: ({ editor, state }) => {
          if (!editor.isEditable) return false
          return !state.selection.empty
        }
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
            case 'h4':
              chain.toggleHeading({ level: 4 }).run()
              break
            case 'h5':
              chain.toggleHeading({ level: 5 }).run()
              break
            case 'h6':
              chain.toggleHeading({ level: 6 }).run()
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
            case 'code':
              chain.toggleCodeBlock().run()
              break
            case 'icode':
              chain.toggleCode().run()
              break
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
              chain.run()
              openImageMenu()
              break
            }
            case 'link': {
              chain.run()
              openLinkMenu()
              break
            }
            case 'clear':
              chain.unsetAllMarks().clearNodes().run()
              break
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
        // Smart paste fenced code blocks
        const txt = evt.clipboardData?.getData('text/plain') || ''
        if (txt.includes('```')) {
          const html = markdownToHtml(txt)
          if (html) {
            editorRef.current?.chain().focus().insertContent(html).run()
            return true
          }
        }
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
        // Link edit hotkey → open inline link bubble
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
          event.preventDefault()
          openLinkMenu()
          return true
        }
        // Heading shortcuts: Mod-Alt-1/2/3/4/5/6, Mod-Alt-0 to paragraph
        if ((event.metaKey || event.ctrlKey) && event.altKey) {
          const key = event.key
          if (key === '1') { editorRef.current?.chain().focus().toggleHeading({ level: 1 }).run(); event.preventDefault(); return true }
          if (key === '2') { editorRef.current?.chain().focus().toggleHeading({ level: 2 }).run(); event.preventDefault(); return true }
          if (key === '3') { editorRef.current?.chain().focus().toggleHeading({ level: 3 }).run(); event.preventDefault(); return true }
          if (key === '4') { editorRef.current?.chain().focus().toggleHeading({ level: 4 }).run(); event.preventDefault(); return true }
          if (key === '5') { editorRef.current?.chain().focus().toggleHeading({ level: 5 }).run(); event.preventDefault(); return true }
          if (key === '6') { editorRef.current?.chain().focus().toggleHeading({ level: 6 }).run(); event.preventDefault(); return true }
          if (key === '0') { editorRef.current?.chain().focus().setParagraph().run(); event.preventDefault(); return true }
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
          // Close link menu if clicking anywhere outside the link menu panel
          if (linkMenu.open) {
            const insidePanel = !!linkMenuRef.current && linkMenuRef.current.contains(target)
            if (!insidePanel) closeLinkMenu()
          }
          // Close image menu if clicking outside its panel
          if (imageMenu.open) {
            const insidePanel = !!imageMenuRef.current && imageMenuRef.current.contains(target)
            if (!insidePanel) closeImageMenu()
          }
          return false
        },
        mousedown: (_view: unknown, event: Event) => {
          const target = event.target as HTMLElement
          if (linkMenu.open) {
            const insidePanel = !!linkMenuRef.current && linkMenuRef.current.contains(target)
            if (!insidePanel) closeLinkMenu()
          }
          if (imageMenu.open) {
            const insidePanel = !!imageMenuRef.current && imageMenuRef.current.contains(target)
            if (!insidePanel) closeImageMenu()
          }
          return false
        },
        contextmenu: (_view: unknown, event: Event) => {
          const me = event as MouseEvent
          const target = me.target as HTMLElement
          // If right-click inside a table, open table menu at pointer
          const isInEditor = !!containerRef.current?.contains(target)
          const tableEl = target.closest('table')
          if (isInEditor && tableEl) {
            // Move selection near pointer so commands act on that cell
            const coords = editorRef.current?.view.posAtCoords({ left: me.clientX, top: me.clientY })
            if (coords && typeof coords.pos === 'number') {
              editorRef.current?.chain().focus().setTextSelection(coords.pos).run()
            }
            const crect = containerRef.current?.getBoundingClientRect()
            const x = (crect ? me.clientX - crect.left + (containerRef.current?.scrollLeft || 0) : me.clientX)
            const y = (crect ? me.clientY - crect.top + (containerRef.current?.scrollTop || 0) : me.clientY)
            setTableMenu({ open: true, x, y })
            me.preventDefault()
            return true
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

  // Table menu visibility + position moved below menu state declarations

  const isActive = (name: string, attrs?: Record<string, unknown>) => editor?.isActive(name, attrs) ?? false
  const can = (fn: () => boolean) => (editor ? fn() : false)

  // execAndCleanupSlash no longer used (Suggestion handles command execution)

  // Inline link bubble (input + save/unlink)
  const [linkMenu, setLinkMenu] = useState<{ open: boolean; x: number; y: number; value: string; text: string }>({ open: false, x: 0, y: 0, value: '', text: '' })
  const linkMenuRef = useRef<HTMLDivElement | null>(null)
  const computeSelectionXY = () => {
    const crect = containerRef.current?.getBoundingClientRect()
    const sel = window.getSelection()
    if (!crect || !sel || sel.rangeCount === 0) return { x: 8, y: 8 }
    const rect = sel.getRangeAt(0).getBoundingClientRect()
    return {
      x: Math.max(8, rect.left - crect.left + (containerRef.current?.scrollLeft || 0)),
      y: Math.max(8, rect.bottom - crect.top + (containerRef.current?.scrollTop || 0)),
    }
  }
  const openLinkMenu = () => {
    const { x, y } = computeSelectionXY()
    const ed = editorRef.current
    const current = (ed?.getAttributes('link')?.href as string | undefined) || ''
    // Try to read selected text from ProseMirror selection
    let text = ''
    try {
      if (ed) {
        const sel = ed.state.selection
        if (!sel.empty) text = ed.state.doc.textBetween(sel.from, sel.to)
      }
    } catch {}
    setLinkMenu({ open: true, x, y, value: current, text })
  }
  const closeLinkMenu = () => setLinkMenu({ open: false, x: 0, y: 0, value: '', text: '' })

  // Image insert bubble
  const [imageMenu, setImageMenu] = useState<{ open: boolean; x: number; y: number; value: string }>({ open: false, x: 0, y: 0, value: '' })
  const imageMenuRef = useRef<HTMLDivElement | null>(null)
  const openImageMenu = () => {
    const { x, y } = computeSelectionXY()
    setImageMenu({ open: true, x, y, value: '' })
  }
  const closeImageMenu = () => setImageMenu({ open: false, x: 0, y: 0, value: '' })

  // Formatting bubble switched to official BubbleMenu below.

  // Keep BubbleMenu visibility synced with other popups (slash/link/image/table).
  useEffect(() => {
    if (!editor) return
    const ext = editor.extensionManager.extensions.find((e) => e.name === 'bubbleMenu') as TiptapExtension<BubbleMenuOptions, unknown> | undefined
    if (!ext) return
    ext.options.shouldShow = ({ editor, state }) => {
      if (!editor.isEditable) return false
      if (slashMenu.open || linkMenu.open || imageMenu.open || tableMenu.open) return false
      return !state.selection.empty
    }
    editor.view.dispatch(editor.state.tr.setMeta('bubbleMenu', 'updatePosition'))
  }, [editor, slashMenu.open, linkMenu.open, imageMenu.open, tableMenu.open])

  const getSlashQuery = (): string => {
    const ed = editorRef.current
    const range = slashMenu.range
    if (!ed || !range) return ''
    try {
      const doc = ed.state.doc
      const size = doc.content.size
      const from = Math.max(0, Math.min(range.from, size))
      const to = Math.max(from, Math.min(range.to, size))
      return doc.textBetween(from, to).trim().toLowerCase()
    } catch {
      // On any out-of-bounds or transient error, fall back to empty query
      return ''
    }
  }

  // Keep BubbleMenu visibility synced with other popups (slash/link/image/table)
  useEffect(() => {
    if (!editor) return
    const ext = editor.extensionManager.extensions.find((e) => e.name === 'bubbleMenu') as TiptapExtension<BubbleMenuOptions, unknown> | undefined
    if (!ext) return
    ext.options.shouldShow = ({ editor, state }) => {
      if (!editor.isEditable) return false
      if (slashMenu.open || linkMenu.open || imageMenu.open || tableMenu.open) return false
      return !state.selection.empty
    }
    editor.view.dispatch(editor.state.tr.setMeta('bubbleMenu', 'updatePosition'))
  }, [editor, slashMenu.open, linkMenu.open, imageMenu.open, tableMenu.open])

  // Table menu visibility + position
  useEffect(() => {
    if (!editor) return
    const update = () => {
      if (slashMenu.open || linkMenu.open || imageMenu.open) {
        setTableMenu((s) => (s.open ? { open: false, x: 0, y: 0 } : s))
        return
      }
      const inTable = editor.isActive('table')
      if (!inTable) {
        setTableMenu((s) => (s.open ? { open: false, x: 0, y: 0 } : s))
        return
      }
      const { x, y } = computeSelectionXY()
      setTableMenu({ open: true, x, y: Math.max(0, y - 40) })
    }
    editor.on('selectionUpdate', update)
    editor.on('transaction', update)
    return () => {
      editor.off('selectionUpdate', update)
      editor.off('transaction', update)
    }
  }, [editor, slashMenu.open, linkMenu.open, imageMenu.open])

  type SlashItem = { label: string; id: SlashAction; group?: string; aliases?: string[] }
  const allSlashItems: SlashItem[] = [
    { label: 'Heading 1', id: 'h1', group: 'Headings', aliases: ['h1', 'title'] },
    { label: 'Heading 2', id: 'h2', group: 'Headings', aliases: ['h2'] },
    { label: 'Heading 3', id: 'h3', group: 'Headings', aliases: ['h3'] },
    { label: 'Heading 4', id: 'h4', group: 'Headings', aliases: ['h4'] },
    { label: 'Heading 5', id: 'h5', group: 'Headings', aliases: ['h5'] },
    { label: 'Heading 6', id: 'h6', group: 'Headings', aliases: ['h6'] },
    { label: 'Bulleted list', id: 'bullet', group: 'Lists', aliases: ['ul', 'unordered'] },
    { label: 'Numbered list', id: 'ordered', group: 'Lists', aliases: ['ol', 'ordered', 'number'] },
    { label: 'Task list', id: 'task', group: 'Lists', aliases: ['todo', 'checkbox'] },
    { label: 'Quote', id: 'quote', group: 'Blocks', aliases: ['blockquote'] },
    { label: 'Code block', id: 'code', group: 'Blocks', aliases: ['fence', '```'] },
    { label: 'Inline code', id: 'icode', group: 'Blocks', aliases: ['code inline'] },
    { label: 'Horizontal rule', id: 'hr', group: 'Blocks', aliases: ['divider', 'line'] },
    { label: 'Table', id: 'table', group: 'Table' },
    { label: 'Table: add row above', id: 'table-row-above', group: 'Table' },
    { label: 'Table: add row below', id: 'table-row-below', group: 'Table' },
    { label: 'Table: delete row', id: 'table-row-delete', group: 'Table' },
    { label: 'Table: add column left', id: 'table-col-left', group: 'Table' },
    { label: 'Table: add column right', id: 'table-col-right', group: 'Table' },
    { label: 'Table: delete column', id: 'table-col-delete', group: 'Table' },
    { label: 'Table: delete table', id: 'table-delete', group: 'Table' },
    { label: 'Image…', id: 'image', group: 'Media & Links', aliases: ['img', 'picture'] },
    { label: 'Link…', id: 'link', group: 'Media & Links', aliases: ['url'] },
    { label: 'Clear formatting', id: 'clear', group: 'Editing', aliases: ['reset', 'remove style'] },
  ]

  const getSlashItems = () => {
    const q = (slashMenu.query || getSlashQuery()).toLowerCase()
    if (!q) return allSlashItems
    return allSlashItems.filter((it) => (it.label.toLowerCase().includes(q) || (it.aliases || []).some(a => a.toLowerCase().includes(q))))
  }

  const slashIcon = (id: SlashAction) => {
    const cls = 'w-4 h-4 text-slate-500'
    switch (id) {
      case 'h1': return <Heading1 className={cls} />
      case 'h2': return <Heading2 className={cls} />
      case 'h3': return <Heading3 className={cls} />
      case 'h4': return <Heading4 className={cls} />
      case 'h5': return <Heading5 className={cls} />
      case 'h6': return <Heading6 className={cls} />
      case 'bullet': return <List className={cls} />
      case 'ordered': return <ListOrdered className={cls} />
      case 'task': return <CheckCircle className={cls} />
      case 'quote': return <Quote className={cls} />
      case 'code': return <Code className={cls} />
      case 'icode': return <Braces className={cls} />
      case 'hr': return <Minus className={cls} />
      case 'table': return <TableIcon className={cls} />
      case 'image': return <ImageIcon className={cls} />
      case 'link': return <LinkIcon className={cls} />
      case 'clear': return <Eraser className={cls} />
      default: return null
    }
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
        <ToolbarButton active={isActive('heading', { level: 4 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}>
          <Heading4 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('heading', { level: 5 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}>
          <Heading5 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('heading', { level: 6 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}>
          <Heading6 className="w-4 h-4" />
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
        <ToolbarButton onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
        <ToolbarButton onClick={() => {
          openLinkMenu()
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
      <div ref={containerRef} className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="relative p-3">
          {!editor?.getText() && (
            <div className="pointer-events-none absolute left-3 top-3 text-sm text-slate-400 select-none">{placeholder}</div>
          )}
          <EditorContent editor={editor} className="tiptap prose dark:prose-invert max-w-none min-h-full outline-none focus:outline-none" />
        </div>
        {linkMenu.open && (
          <div
            ref={linkMenuRef}
            style={{ position: 'absolute', left: linkMenu.x, top: linkMenu.y, zIndex: 1000, minWidth: 320 }}
            className="rounded-md border bg-white dark:bg-slate-800 shadow-lg p-2 text-sm"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={linkMenu.value}
                onChange={(e) => setLinkMenu((s) => ({ ...s, value: e.target.value }))}
                placeholder="https://"
                className="w-56 px-2 py-1 rounded border bg-transparent text-sm"
              />
              <input
                value={linkMenu.text}
                onChange={(e) => setLinkMenu((s) => ({ ...s, text: e.target.value }))}
                placeholder="Link text"
                className="w-40 px-2 py-1 rounded border bg-transparent text-sm"
              />
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                onClick={() => {
                  const href = linkMenu.value.trim()
                  const txt = (linkMenu.text || '').trim()
                  const ed = editor
                  if (!ed) return
                  if (!href) {
                    ed.chain().focus().unsetLink().run()
                    closeLinkMenu()
                    return
                  }
                  if (txt) {
                    // Replace or insert with explicit text wrapped in link
                    const escapedHref = href.replace(/"/g, '&quot;')
                    const escapedText = txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    ed.chain().focus().insertContent(`<a href="${escapedHref}">${escapedText}</a>`).run()
                    closeLinkMenu()
                    return
                  }
                  // No text provided
                  if (!ed.state.selection.empty) {
                    ed.chain().focus().setLink({ href }).run()
                  } else {
                    const escapedHref = href.replace(/"/g, '&quot;')
                    const escapedText = href.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    ed.chain().focus().insertContent(`<a href="${escapedHref}">${escapedText}</a>`).run()
                  }
                  closeLinkMenu()
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-100 dark:bg-slate-700"
                onClick={() => { editor?.chain().focus().unsetLink().run(); closeLinkMenu() }}
              >
                Unlink
              </button>
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-100 dark:bg-slate-700"
                onClick={() => closeLinkMenu()}
                aria-label="Close link editor"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {imageMenu.open && (
          <div
            ref={imageMenuRef}
            style={{ position: 'absolute', left: imageMenu.x, top: imageMenu.y, zIndex: 1000, minWidth: 280 }}
            className="rounded-md border bg-white dark:bg-slate-800 shadow-lg p-2 text-sm"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={imageMenu.value}
                onChange={(e) => setImageMenu((s) => ({ ...s, value: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const url = imageMenu.value.trim()
                    if (url) editor?.chain().focus().setImage({ src: url }).run()
                    closeImageMenu()
                  }
                  if (e.key === 'Escape') closeImageMenu()
                }}
                placeholder="Image URL or base64"
                className="w-56 px-2 py-1 rounded border bg-transparent text-sm"
              />
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900"
                onClick={() => {
                  const url = imageMenu.value.trim()
                  if (url) editor?.chain().focus().setImage({ src: url }).run()
                  closeImageMenu()
                }}
              >
                Insert
              </button>
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-100 dark:bg-slate-700"
                onClick={() => closeImageMenu()}
                aria-label="Close image editor"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {editor && bubbleEl && createPortal(
          <div
            className="rounded-md border bg-white dark:bg-slate-800 shadow p-1 flex items-center gap-1"
            onMouseDown={(e) => e.preventDefault()}
          >
            <ToolbarButton active={isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></ToolbarButton>
            <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <ToolbarButton active={isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()}><Braces className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('link')} onClick={() => { openLinkMenu() }}><LinkIcon className="w-4 h-4" /></ToolbarButton>
          </div>,
          bubbleEl
        )}
        {tableMenu.open && (
          <div
            style={{ position: 'absolute', left: tableMenu.x, top: tableMenu.y, zIndex: 1000 }}
            className="rounded-md border bg-white dark:bg-slate-800 shadow p-1 flex items-center gap-1"
            onMouseDown={(e) => e.preventDefault()}
          >
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().addRowBefore().run())} onClick={() => editor?.chain().focus().addRowBefore().run()}><ChevronUp className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().addRowAfter().run())} onClick={() => editor?.chain().focus().addRowAfter().run()}><ChevronDown className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().deleteRow().run())} onClick={() => editor?.chain().focus().deleteRow().run()}><Trash2 className="w-4 h-4" /></ToolbarButton>
            <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().addColumnBefore().run())} onClick={() => editor?.chain().focus().addColumnBefore().run()}><ChevronLeft className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().addColumnAfter().run())} onClick={() => editor?.chain().focus().addColumnAfter().run()}><ChevronRight className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().deleteColumn().run())} onClick={() => editor?.chain().focus().deleteColumn().run()}><Trash2 className="w-4 h-4" /></ToolbarButton>
            <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
            {/* Merge disabled by product policy (Markdown compatibility) */}
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().toggleHeaderRow().run())} onClick={() => editor?.chain().focus().toggleHeaderRow().run()}>Hdr Row</ToolbarButton>
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().toggleHeaderColumn().run())} onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}>Hdr Col</ToolbarButton>
            <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <ToolbarButton disabled={!can(() => editor!.can().chain().focus().deleteTable().run())} onClick={() => editor?.chain().focus().deleteTable().run()}><TableIcon className="w-4 h-4" /></ToolbarButton>
          </div>
        )}
        {slashMenu.open && (
          <div
            style={{ position: 'absolute', left: slashMenu.x, top: slashMenu.y, zIndex: 1000, minWidth: 240 }}
            className="rounded-md border bg-white dark:bg-slate-800 shadow-lg p-1 text-sm">
            <div className="px-2 py-1.5 text-xs text-slate-500">Quick insert</div>
            <div className="max-h-64 overflow-auto">
              {(() => {
                const items = getSlashItems()
                const rows: React.ReactNode[] = []
                let lastGroup: string | undefined
                items.forEach((it, idx) => {
                  if (it.group && it.group !== lastGroup) {
                    rows.push(
                      <div key={`group-${it.group}-${idx}`} className="px-2 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400">{it.group}</div>
                    )
                  }
                  rows.push(
                    <button
                      key={`item-${it.label}-${idx}`}
                      className={["w-full text-left px-2 py-1 rounded flex items-center gap-2",
                        idx === slashMenu.index ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-700"].join(' ')}
                      onMouseDown={(e) => { e.preventDefault() }}
                      onClick={() => slashMenu.invoke?.({ action: it.id })}
                    >
                      <span className="shrink-0">{slashIcon(it.id)}</span>
                      <span>{it.label}</span>
                    </button>
                  )
                  lastGroup = it.group
                })
                return rows
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RichEditorLite
