import React, { useEffect, useMemo, useRef, useState } from 'react'
import './styles.css'
import { EditorContent, useEditor } from '@tiptap/react'
import BubbleMenuExt, { type BubbleMenuOptions } from '@tiptap/extension-bubble-menu'
import type { Extension as TiptapExtension } from '@tiptap/core'
import { createPortal } from 'react-dom'
import Placeholder from '@tiptap/extension-placeholder'
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/common/components/ui/dropdown-menu'

import { htmlToMarkdown, markdownToHtml } from '@/common/utils/markdown-converter'
import SlashCommand, { type SlashOpenPayload, type SlashAction } from './extensions/slash-command'
import { lowlight } from 'lowlight/lib/common'
import HeadingToggle from './extensions/heading-toggle'
import { useTranslation } from 'react-i18next'

interface RichEditorLiteProps {
  value: string
  onChange?: (markdown: string) => void
  editable?: boolean
  placeholder?: string
  className?: string
  variant?: 'default' | 'frameless'
  compactToolbar?: boolean
  maxHeight?: number | string
  minHeight?: number | string
  hideToolbar?: boolean
  enterSends?: boolean
  onSubmitEnter?: () => void
  suspended?: boolean
}

type ToolbarButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  active?: boolean
  size?: 'sm' | 'md'
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ disabled, active, onClick, children, size = 'md', className = '', ...rest }, ref) => {
    const sizeCls = size === 'sm' ? 'h-5 w-5 text-[11px]' : 'h-7 w-7 text-[13px]'
    const hoverCls = size === 'sm' ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={[
          'inline-flex items-center justify-center rounded transition-colors',
          sizeCls,
          disabled ? 'opacity-40 cursor-not-allowed' : hoverCls,
          active ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent',
          className,
        ].join(' ')}
        {...rest}
      >
        {children}
      </button>
    )
  }
)
ToolbarButton.displayName = 'ToolbarButton'

export function RichEditorLite({ value, onChange, editable = true, placeholder, className = '', variant = 'default', maxHeight, minHeight, enterSends = false, onSubmitEnter, hideToolbar, suspended = false }: RichEditorLiteProps) {
  const { t } = useTranslation()
  const defaultPlaceholder = placeholder || t('editor.placeholder')
  // Create bubble menu element before editor initialization so the extension can mount.
  const bubbleEl = useMemo<HTMLElement>(() => {
    const el = document.createElement('div')
    // Ensure BubbleMenu sits above editor content but below our modals
    el.style.zIndex = '1100' // above editor content; our menus use ~1000
    // plugin will set position/coords; keep pointer events enabled for hover
    el.style.pointerEvents = 'auto'
    return el
  }, [])
  const initialHtml = useMemo(() => markdownToHtml(value || ''), [value])
  const lastMarkdownRef = useRef<string>(value || '')
  const editorRef = useRef<Editor | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [slashMenu, setSlashMenu] = useState<{ open: boolean; x: number; y: number; fixed?: boolean; place?: 'up' | 'down'; range?: { from: number; to: number }; index: number; query: string; invoke?: (p: { action: SlashAction }) => void }>({ open: false, x: 0, y: 0, index: 0, query: '' })
  // Keep a live ref of slashMenu so extension callbacks (which are created once) read fresh state
  const slashMenuRef = useRef(slashMenu)
  useEffect(() => { slashMenuRef.current = slashMenu }, [slashMenu])
  const slashListRef = useRef<HTMLDivElement | null>(null)
  const [tableHandles, setTableHandles] = useState<{ open: boolean; rowX: number; rowY: number; colX: number; colY: number }>({ open: false, rowX: 0, rowY: 0, colX: 0, colY: 0 })
  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const [near, setNear] = useState<{ row: boolean; col: boolean }>({ row: false, col: false })

  const [linkMenu, setLinkMenu] = useState<{ open: boolean; x: number; y: number; value: string; text: string }>({ open: false, x: 0, y: 0, value: '', text: '' })
  const linkMenuRef = useRef<HTMLDivElement | null>(null)
  const [imageMenu, setImageMenu] = useState<{ open: boolean; x: number; y: number; value: string }>({ open: false, x: 0, y: 0, value: '' })
  const imageMenuRef = useRef<HTMLDivElement | null>(null)

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
    let text = ''
    try {
      if (ed) {
        const sel = ed.state.selection
        if (!sel.empty) text = ed.state.doc.textBetween(sel.from, sel.to)
      }
    } catch (_err) { text = '' }
    setLinkMenu({ open: true, x, y, value: current, text })
  }

  const openImageMenu = () => {
    const { x, y } = computeSelectionXY()
    setImageMenu({ open: true, x, y, value: '' })
  }

  const extensions = useMemo(() => [
      // Disable default codeBlock from StarterKit; we'll use Lowlight version
      StarterKit.configure({ codeBlock: false, heading: false }),
      HeadingToggle,
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
        appendTo: () => document.body,
        // initial rule; will be kept in sync via effect below
        shouldShow: ({ editor, state }) => {
          if (!editor.isEditable) return false
          return !state.selection.empty
        }
      }),
      Placeholder.configure({
        placeholder: defaultPlaceholder,
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
      SlashCommand.configure({
        onOpen: (p: SlashOpenPayload) => {
          // Smart placement: choose up or down based on available viewport space
          type RectLike = DOMRect | { left: number; top: number; bottom?: number }
          const raw: RectLike = p.clientRect || { left: 8, top: 8, bottom: 16 }
          const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
          const vh = typeof window !== 'undefined' ? window.innerHeight : 768
          const top = raw.top
          const left = raw.left
          const bottom = 'bottom' in raw && typeof raw.bottom === 'number' ? raw.bottom : top + 16
          const spaceAbove = Math.max(0, top)
          const spaceBelow = Math.max(0, vh - bottom)
          const preferred: 'up' | 'down' = spaceBelow >= spaceAbove ? 'down' : 'up'
          const x = Math.max(8, Math.min(left, vw - 260))
          const y = preferred === 'up' ? top : bottom
          setSlashMenu({ open: true, x, y, fixed: true, place: preferred, range: p.range, index: 0, query: p.query, invoke: p.invoke })
        },
        onUpdate: (p: SlashOpenPayload) => {
          type RectLike = DOMRect | { left: number; top: number; bottom?: number }
          const raw: RectLike = p.clientRect || { left: 8, top: 8, bottom: 16 }
          const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
          const vh = typeof window !== 'undefined' ? window.innerHeight : 768
          const top = raw.top
          const left = raw.left
          const bottom = 'bottom' in raw && typeof raw.bottom === 'number' ? raw.bottom : top + 16
          const spaceAbove = Math.max(0, top)
          const spaceBelow = Math.max(0, vh - bottom)
          const preferred: 'up' | 'down' = spaceBelow >= spaceAbove ? 'down' : 'up'
          const x = Math.max(8, Math.min(left, vw - 260))
          const y = preferred === 'up' ? top : bottom
          setSlashMenu((s) => ({ ...(s || { open: true, index: 0 }), open: true, x, y, fixed: true, place: preferred, range: p.range, query: p.query, invoke: p.invoke }))
        },
        onClose: () => setSlashMenu({ open: false, x: 0, y: 0, index: 0, query: '' }),
        onMoveIndex: (delta: number) => setSlashMenu((s) => {
          const items = getSlashItems()
          const next = Math.max(0, Math.min(items.length - 1, s.index + delta))
          return { ...s, index: next }
        }),
        onEnter: () => {
          // Read latest menu state from ref to avoid stale closure inside extension callback
          const menu = slashMenuRef.current
          const item = getSlashItems().at(menu.index)
          if (item && menu.invoke) {
            menu.invoke({ action: (item as { id: SlashAction }).id })
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
    ], [placeholder, bubbleEl, setSlashMenu, openImageMenu, openLinkMenu])

  const editor = useEditor({
    extensions,
    content: initialHtml,
    editable,
    editorProps: {
      attributes: {
        spellcheck: 'false',
        // Default editor has comfortable min-height; frameless (compact) removes it and fills parent
        style: variant === 'frameless'
          ? 'padding: 4px 6px; outline: none; height: 100%;'
          : 'min-height: 240px; padding: 12px; outline: none;',
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
        // Inline send mode: Ctrl/Cmd+Enter sends; Enter keeps adding new lines
        if (enterSends && event.key === 'Enter') {
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            onSubmitEnter?.()
            return true
          }
          return false
        }
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
        // Slash menu navigation is handled by Suggestion plugin's onKeyDown
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
        // Escape is handled by Suggestion and BubbleMenu extensions; do not consume here
        return false
      },
      handleDOMEvents: {
        dblclick: (_view: unknown, event: Event) => {
          const target = event.target as HTMLElement
          if (target && target.tagName === 'IMG') {
            const newUrl = window.prompt(t('editor.image.urlPrompt'), (target as HTMLImageElement).src || '')
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
        // contextmenu: keep default; table has dedicated handles
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

  useEffect(() => {
    if (!editor) return
    const placeholderExtension = editor.extensionManager.extensions.find(ext => ext.name === 'placeholder')
    if (placeholderExtension && placeholderExtension.options) {
      placeholderExtension.options.placeholder = placeholder
      const editorElement = editor.view.dom
      const placeholderElements = editorElement.querySelectorAll('[data-placeholder]')
      placeholderElements.forEach((el: Element) => {
        ;(el as HTMLElement).setAttribute('data-placeholder', placeholder || '')
      })
    }
  }, [placeholder, editor])

  // When parent collapses/suspends the editor (e.g., composer hidden), close all popups and blur
  useEffect(() => {
    if (!editorRef.current) return
    if (suspended) {
      try { editorRef.current.commands.blur() } catch { /* ignore */ }
      setSlashMenu({ open: false, x: 0, y: 0, index: 0, query: '' })
      setLinkMenu({ open: false, x: 0, y: 0, value: '', text: '' })
      setImageMenu({ open: false, x: 0, y: 0, value: '' })
    }
  }, [suspended])

  // Keep the highlighted slash item in view when navigating via keyboard
  useEffect(() => {
    if (!slashMenu.open) return
    const list = slashListRef.current
    if (!list) return
    const active = list.querySelector(`[data-slash-index="${slashMenu.index}"]`) as HTMLElement | null
    if (active) {
      // If not fully visible, scroll it into view without jumping the list too much
      const { offsetTop } = active
      const itemBottom = offsetTop + active.offsetHeight
      const viewTop = list.scrollTop
      const viewBottom = viewTop + list.clientHeight
      if (offsetTop < viewTop) {
        list.scrollTo({ top: offsetTop, behavior: 'auto' })
      } else if (itemBottom > viewBottom) {
        const delta = itemBottom - viewBottom
        list.scrollTo({ top: viewTop + delta, behavior: 'auto' })
      }
    }
  }, [slashMenu.index, slashMenu.open])

  // Table menu visibility + position moved below menu state declarations

  const isActive = (name: string, attrs?: Record<string, unknown>) => editor?.isActive(name, attrs) ?? false
  const can = (fn: () => boolean) => (editor ? fn() : false)

  type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
  const headingLevels: HeadingLevel[] = [1, 2, 3, 4, 5, 6]
  const activeHeadingLevel = editor ? headingLevels.find(level => editor.isActive('heading', { level })) : undefined
  const headingLabel = activeHeadingLevel ? `H${activeHeadingLevel}` : t('richEditor.text')


  // execAndCleanupSlash no longer used (Suggestion handles command execution)

  const closeLinkMenu = () => setLinkMenu({ open: false, x: 0, y: 0, value: '', text: '' })
  const closeImageMenu = () => setImageMenu({ open: false, x: 0, y: 0, value: '' })

  // Formatting bubble switched to official BubbleMenu below.

  // Keep BubbleMenu visibility synced with other popups (slash/link/image).
  useEffect(() => {
    if (!editor) return
    const ext = editor.extensionManager.extensions.find((e) => e.name === 'bubbleMenu') as TiptapExtension<BubbleMenuOptions, unknown> | undefined
    if (!ext) return
    ext.options.shouldShow = ({ editor, state }) => {
      if (!editor.isEditable) return false
      if (slashMenu.open || linkMenu.open || imageMenu.open) return false
      return !state.selection.empty
    }
    editor.view.dispatch(editor.state.tr.setMeta('bubbleMenu', 'updatePosition'))
  }, [editor, slashMenu.open, linkMenu.open, imageMenu.open])

  // getSlashQuery removed; we rely solely on Suggestion's provided query

  // remove duplicate BubbleMenu syncing effect

  // Table handles: compute row/col entry positions at row first-cell left boundary and first-row top boundary for selected col
  useEffect(() => {
    if (!editor) return
    let raf = 0
    const update = () => {
      try {
        const view = editor.view
        const { from } = editor.state.selection
        const dom = view.domAtPos(from)
        const n: Node | null = dom.node as Node
        const el: Element | null = (n && n.nodeType === 3 ? (n.parentElement) : (n as Element))
        const cell = el?.closest('td,th') as HTMLTableCellElement | null
        const row = cell?.closest('tr') as HTMLTableRowElement | null
        const table = cell?.closest('table') as HTMLTableElement | null
        if (!cell || !row || !table) {
          setTableHandles((s) => (s.open ? { ...s, open: false } : s))
          return
        }
        const firstCellInRow = (row.cells && row.cells.length > 0) ? row.cells[0] : (row.querySelector('th,td') as HTMLTableCellElement | null)
        const firstRow = table.querySelector('tr') as HTMLTableRowElement | null
        const topCellInCol = firstRow ? firstRow.cells[cell.cellIndex] : null
        if (!firstCellInRow || !topCellInCol) {
          setTableHandles((s) => (s.open ? { ...s, open: false } : s))
          return
        }
        const crect = containerRef.current?.getBoundingClientRect()
        const sl = containerRef.current?.scrollLeft || 0
        const st = containerRef.current?.scrollTop || 0
        const rowRect = row.getBoundingClientRect()
        const firstRowCellRect = firstCellInRow.getBoundingClientRect()
        const topCellRect = topCellInCol.getBoundingClientRect()
        // Base anchors right at the cell borders (no overlap), then UI shifts itself entirely outside via CSS transforms.
        const baseRowX = firstRowCellRect.left - (crect?.left || 0) + sl
        const baseRowY = (rowRect.top + rowRect.height / 2) - (crect?.top || 0) + st
        const baseColX = (topCellRect.left + topCellRect.width / 2) - (crect?.left || 0) + sl
        const baseColY = topCellRect.top - (crect?.top || 0) + st
        // Clamp to keep anchors inside container (handles shift outward by transform)
        const cw = crect?.width || 0
        const ch = crect?.height || 0
        const margin = 1
        const rowX = Math.max(margin, Math.min(baseRowX, cw - margin))
        const rowY = Math.max(margin, Math.min(baseRowY, ch - margin))
        const colX = Math.max(margin, Math.min(baseColX, cw - margin))
        const colY = Math.max(margin, Math.min(baseColY, ch - margin))
        setTableHandles({ open: true, rowX, rowY, colX, colY })
      } catch {
        setTableHandles((s) => (s.open ? { ...s, open: false } : s))
      }
    }
    const trigger = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    editor.on('selectionUpdate', trigger)
    editor.on('transaction', trigger)
    const onScroll = () => trigger()
    const onResize = () => trigger()
    const onMouseMove = (e: MouseEvent) => {
      const crect = containerRef.current?.getBoundingClientRect()
      if (!crect) return
      setPointer({ x: e.clientX - crect.left + (containerRef.current?.scrollLeft || 0), y: e.clientY - crect.top + (containerRef.current?.scrollTop || 0) })
    }
    containerRef.current?.addEventListener('scroll', onScroll)
    containerRef.current?.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)
    trigger()
    return () => {
      editor.off('selectionUpdate', trigger)
      editor.off('transaction', trigger)
      containerRef.current?.removeEventListener('scroll', onScroll)
      containerRef.current?.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [editor])

  // Fade in/out handles based on pointer proximity to anchors
  useEffect(() => {
    const threshold = 20 // px
    const dr = Math.hypot(pointer.x - tableHandles.rowX, pointer.y - tableHandles.rowY)
    const dc = Math.hypot(pointer.x - tableHandles.colX, pointer.y - tableHandles.colY)
    setNear({ row: tableHandles.open && dr <= threshold, col: tableHandles.open && dc <= threshold })
  }, [pointer, tableHandles])

  type SlashItem = { label: string; id: SlashAction; group?: string; aliases?: string[] }
  const allSlashItems: SlashItem[] = [
    { label: t('richEditor.slashCommands.heading1'), id: 'h1', group: t('richEditor.slashCommands.groups.headings'), aliases: ['h1', 'title'] },
    { label: t('richEditor.slashCommands.heading2'), id: 'h2', group: t('richEditor.slashCommands.groups.headings'), aliases: ['h2'] },
    { label: t('richEditor.slashCommands.heading3'), id: 'h3', group: t('richEditor.slashCommands.groups.headings'), aliases: ['h3'] },
    { label: t('richEditor.slashCommands.bulletedList'), id: 'bullet', group: t('richEditor.slashCommands.groups.lists'), aliases: ['ul', 'unordered'] },
    { label: t('richEditor.slashCommands.numberedList'), id: 'ordered', group: t('richEditor.slashCommands.groups.lists'), aliases: ['ol', 'ordered', 'number'] },
    { label: t('richEditor.slashCommands.taskList'), id: 'task', group: t('richEditor.slashCommands.groups.lists'), aliases: ['todo', 'checkbox'] },
    { label: t('richEditor.slashCommands.quote'), id: 'quote', group: t('richEditor.slashCommands.groups.blocks'), aliases: ['blockquote'] },
    { label: t('richEditor.slashCommands.codeBlock'), id: 'code', group: t('richEditor.slashCommands.groups.blocks'), aliases: ['fence', '```'] },
    { label: t('richEditor.slashCommands.inlineCode'), id: 'icode', group: t('richEditor.slashCommands.groups.blocks'), aliases: ['code inline'] },
    { label: t('richEditor.slashCommands.horizontalRule'), id: 'hr', group: t('richEditor.slashCommands.groups.blocks'), aliases: ['divider', 'line'] },
    { label: t('richEditor.slashCommands.table'), id: 'table', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.tableAddRowAbove'), id: 'table-row-above', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.tableAddRowBelow'), id: 'table-row-below', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.tableDeleteRow'), id: 'table-row-delete', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.tableAddColumnLeft'), id: 'table-col-left', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.tableAddColumnRight'), id: 'table-col-right', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.tableDeleteColumn'), id: 'table-col-delete', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.tableDeleteTable'), id: 'table-delete', group: t('richEditor.slashCommands.groups.table') },
    { label: t('richEditor.slashCommands.image'), id: 'image', group: t('richEditor.slashCommands.groups.mediaLinks'), aliases: ['img', 'picture'] },
    { label: t('richEditor.slashCommands.link'), id: 'link', group: t('richEditor.slashCommands.groups.mediaLinks'), aliases: ['url'] },
    { label: t('richEditor.slashCommands.clearFormatting'), id: 'clear', group: t('richEditor.slashCommands.groups.editing'), aliases: ['reset', 'remove style'] },
  ]

  const getSlashItems = () => {
    // Use Suggestion plugin's query only; when it's empty string we should show all items.
    const q = (slashMenu.query ?? '').toLowerCase()
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

  const outerStyle: React.CSSProperties = {
    ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : String(maxHeight) } : {}),
    ...(minHeight ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : String(minHeight) } : {}),
  }

  return (
    <div
      style={outerStyle}
      className={[
        variant === 'frameless' ? "border-0 rounded-none bg-transparent" : "border rounded-md bg-background",
        "flex flex-col min-h-0 gap-y-0",
        className,
      ].join(' ')}
    >
      {!hideToolbar && (
      <div className={'flex items-center gap-0.5 px-1 pb-2 shrink-0'}>
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
        <div className="mx-0.5 h-4 w-px bg-slate-200/60 dark:bg-slate-700/60" />
        <ToolbarButton disabled={!can(() => editor!.can().chain().focus().undo().run())} onClick={() => editor?.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton disabled={!can(() => editor!.can().chain().focus().redo().run())} onClick={() => editor?.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Eraser className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-0.5 h-4 w-px bg-slate-200/60 dark:bg-slate-700/60" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ToolbarButton
              active={!!activeHeadingLevel}
              onClick={() => {}}
              className="px-1.5 min-w-[44px] justify-between gap-1 text-xs"
            >
              <span className="font-medium text-xs">{headingLabel}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </ToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36 p-1 text-xs">
            <DropdownMenuItem
              onSelect={() => editor?.chain().focus().setParagraph().run()}
              className="flex items-center gap-2"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-hidden="true">
                ¶
              </span>
              <span className="font-medium">{t('richEditor.text')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            {headingLevels.map(level => (
              <DropdownMenuItem
                key={level}
                onSelect={() => editor?.chain().focus().toggleHeading({ level }).run()}
                className="flex items-center gap-2"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-hidden="true">
                  H{level}
                </span>
                <span className="font-medium">{t('richEditor.heading', { level })}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="mx-0.5 h-4 w-px bg-slate-200/60 dark:bg-slate-700/60" />
        <ToolbarButton active={isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton active={isActive('taskList')} onClick={() => editor?.chain().focus().toggleTaskList().run()}>
          <CheckCircle className="w-4 h-4" />
        </ToolbarButton>
        <div className="mx-0.5 h-4 w-px bg-slate-200/60 dark:bg-slate-700/60" />
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
        <div className="mx-0.5 h-4 w-px bg-slate-200/60 dark:bg-slate-700/60" />
        <ToolbarButton onClick={() => {
          openLinkMenu()
        }}>
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {
          const url = window.prompt(t('editor.image.urlOrBase64Prompt'))
          if (url) editor?.chain().focus().setImage({ src: url }).run()
        }}>
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <TableIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>
      )}
      <div ref={containerRef} className="relative min-h-0 flex-1 overflow-y-auto">
        <div
          className={[
            "relative h-full",
            hideToolbar ? "" : "mt-0.5",
            variant === 'frameless' ? "px-3 pb-0" : "px-3 pb-3",
          ].join(' ')}
        >
          <EditorContent
            editor={editor}
            className={[
              variant === 'frameless'
                ? 'tiptap max-w-none h-full outline-none focus:outline-none'
                : 'tiptap prose dark:prose-invert max-w-none h-full outline-none focus:outline-none'
            ].join(' ')}
          />
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
                placeholder={t('editor.link.urlPlaceholder')}
                className="w-56 px-2 py-1 rounded border bg-transparent text-sm"
              />
              <input
                value={linkMenu.text}
                onChange={(e) => setLinkMenu((s) => ({ ...s, text: e.target.value }))}
                placeholder={t('editor.link.textPlaceholder')}
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
                {t('common.save')}
              </button>
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-100 dark:bg-slate-700"
                onClick={() => { editor?.chain().focus().unsetLink().run(); closeLinkMenu() }}
              >
                {t('editor.link.unlink')}
              </button>
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-100 dark:bg-slate-700"
                onClick={() => closeLinkMenu()}
                aria-label={t('editor.link.close')}
              >
                {t('common.close')}
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
                placeholder={t('editor.image.urlPlaceholder')}
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
                {t('editor.image.insert')}
              </button>
              <button
                type="button"
                className="px-2 h-7 rounded text-xs bg-slate-100 dark:bg-slate-700"
                onClick={() => closeImageMenu()}
                aria-label={t('editor.image.close')}
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        )}
        {editor && bubbleEl && createPortal(
          <div
            className="rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 p-1 flex items-center gap-0.5"
            onMouseDown={(e) => e.preventDefault()}
          >
            <ToolbarButton active={isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></ToolbarButton>
            <div className="mx-0.5 h-4 w-px bg-slate-200/60 dark:bg-slate-700/60" />
            <ToolbarButton active={isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()}><Braces className="w-4 h-4" /></ToolbarButton>
            <ToolbarButton active={isActive('link')} onClick={() => { openLinkMenu() }}><LinkIcon className="w-4 h-4" /></ToolbarButton>
          </div>,
          bubbleEl
        )}
        {tableHandles.open && (
          <>
            <div
              style={{ position: 'absolute', left: tableHandles.rowX, top: tableHandles.rowY, zIndex: 1000, transform: 'translateX(-100%) translateX(-1px) translateY(-50%)' }}
              className={["bg-transparent border-0 shadow-none p-0 flex flex-col items-center gap-0.5 transition-opacity",
                near.row ? "opacity-100" : "opacity-30"].join(' ')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ToolbarButton size="sm" className="hover:bg-slate-900/10 dark:hover:bg-white/15" disabled={!can(() => editor!.can().chain().focus().addRowBefore().run())} onClick={() => editor?.chain().focus().addRowBefore().run()}><ChevronUp className="w-3 h-3" strokeWidth={2} /></ToolbarButton>
              <ToolbarButton size="sm" className="hover:bg-slate-900/10 dark:hover:bg-white/15" disabled={!can(() => editor!.can().chain().focus().deleteRow().run())} onClick={() => editor?.chain().focus().deleteRow().run()}><Trash2 className="w-3 h-3" strokeWidth={2} /></ToolbarButton>
              <ToolbarButton size="sm" className="hover:bg-slate-900/10 dark:hover:bg-white/15" disabled={!can(() => editor!.can().chain().focus().addRowAfter().run())} onClick={() => editor?.chain().focus().addRowAfter().run()}><ChevronDown className="w-3 h-3" strokeWidth={2} /></ToolbarButton>
            </div>
            <div
              style={{ position: 'absolute', left: tableHandles.colX, top: tableHandles.colY, zIndex: 1000, transform: 'translateY(-100%) translateY(-1px) translateX(-50%)' }}
              className={["bg-transparent border-0 shadow-none p-0 flex items-center gap-0.5 transition-opacity",
                near.col ? "opacity-100" : "opacity-30"].join(' ')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ToolbarButton size="sm" className="hover:bg-slate-900/10 dark:hover:bg-white/15" disabled={!can(() => editor!.can().chain().focus().addColumnBefore().run())} onClick={() => editor?.chain().focus().addColumnBefore().run()}><ChevronLeft className="w-3 h-3" strokeWidth={2} /></ToolbarButton>
              <ToolbarButton size="sm" className="hover:bg-slate-900/10 dark:hover:bg-white/15" disabled={!can(() => editor!.can().chain().focus().deleteColumn().run())} onClick={() => editor?.chain().focus().deleteColumn().run()}><Trash2 className="w-3 h-3" strokeWidth={2} /></ToolbarButton>
              <ToolbarButton size="sm" className="hover:bg-slate-900/10 dark:hover:bg-white/15" disabled={!can(() => editor!.can().chain().focus().addColumnAfter().run())} onClick={() => editor?.chain().focus().addColumnAfter().run()}><ChevronRight className="w-3 h-3" strokeWidth={2} /></ToolbarButton>
            </div>
          </>
        )}
        {slashMenu.open && createPortal(
          <div
            style={{ position: 'fixed', left: slashMenu.x, top: slashMenu.y, zIndex: 1100, minWidth: 240, transform: slashMenu.place === 'up' ? 'translateY(-100%) translateY(-8px)' : 'translateY(8px)' }}
            className="rounded-md border bg-white dark:bg-slate-800 shadow-lg p-1 text-sm">
            <div ref={slashListRef} className="max-h-64 overflow-auto">
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
                      data-slash-index={idx}
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
          </div>,
          document.body
        )}
      </div>
    </div>
  )
}

export default RichEditorLite
