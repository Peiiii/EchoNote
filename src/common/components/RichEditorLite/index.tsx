import React, { useEffect, useMemo, useRef } from 'react'
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
        // Indent/outdent behaviors for task list (and fallback to bullet/ordered)
        if (event.key === 'Tab') {
          event.preventDefault()
          if (event.shiftKey) {
            const ran = !!(
              editorRef.current?.chain().focus().liftListItem('taskItem').run() ||
              editorRef.current?.chain().focus().liftListItem('listItem').run()
            )
            return ran
          }
          const ran = !!(
            editorRef.current?.chain().focus().sinkListItem('taskItem').run() ||
            editorRef.current?.chain().focus().sinkListItem('listItem').run()
          )
          return ran
        }
        return false
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
      <div className="relative min-h-0 flex-1 overflow-y-auto p-3">
        {!editor?.getText() && (
          <div className="pointer-events-none absolute left-3 top-3 text-sm text-slate-400 select-none">{placeholder}</div>
        )}
        <EditorContent editor={editor} className="tiptap prose dark:prose-invert max-w-none min-h-full outline-none focus:outline-none" />
      </div>
    </div>
  )
}

export default RichEditorLite
