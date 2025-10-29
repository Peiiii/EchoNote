import React, { useMemo, useRef, useState } from 'react'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

type Props = {
  node: { attrs: { language?: string | null } }
  updateAttributes: (attrs: Record<string, unknown>) => void
  extension: typeof CodeBlockLowlight
}

const aliasToCanonical: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  'c++': 'cpp',
  'c#': 'csharp',
  sh: 'bash',
  zsh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
  py: 'python',
  golang: 'go',
}

function normalizeLanguage(input: string, all: string[]): string | null {
  const v = input.trim().toLowerCase()
  if (!v) return null
  if (aliasToCanonical[v]) return aliasToCanonical[v]
  // direct hit
  if (all.includes(v)) return v
  // try fuzzy matches (e.g. "plain", "text") fallback to null
  if (v === 'text' || v === 'plain' || v === 'plaintext') return null
  return v
}

let recentLangs: string[] = []

const CodeBlockView: React.FC<Props> = ({ node, updateAttributes, extension }) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const unmountedRef = useRef(false)
  const timerRef = useRef<number | null>(null)
  const contentRef = useRef<HTMLPreElement | null>(null)

  type LowlightLike = { listLanguages?: () => string[] }
  const ll = (extension.options && (extension.options as { lowlight?: LowlightLike }).lowlight) || undefined
  const all = useMemo(() => (ll?.listLanguages ? ll.listLanguages() : []), [ll])

  const current = node.attrs.language || null
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter((l) => l.toLowerCase().includes(q))
  }, [all, query])

  const applyLanguage = (lang: string | null) => {
    updateAttributes({ language: lang })
    setOpen(false)
    if (lang) {
      // maintain a small recent list
      recentLangs = [lang, ...recentLangs.filter((l) => l !== lang)].slice(0, 6)
    }
  }

  const copyCode = async () => {
    try {
      const el = contentRef.current
      if (!el) return
      // Collect plain text from code block
      const text = el.textContent || ''
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => { if (!unmountedRef.current) setCopied(false) }, 1200)
    } catch {
      // ignore
    }
  }

  React.useEffect(() => {
    unmountedRef.current = false
    return () => {
      unmountedRef.current = true
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  // Line-number UI removed per request; keep minimal refs for copy.

  return (
    <NodeViewWrapper as="div" className="relative group">
      <div
        className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-95"
        onMouseDown={(e) => {
          // keep editor focus
          e.preventDefault()
        }}
      >
        <button
          type="button"
          className="px-2 h-6 rounded text-xs bg-slate-800/80 text-white hover:bg-slate-800"
          onClick={() => setOpen((v) => !v)}
        >
          {current || 'Plain text'}
        </button>
        <button
          type="button"
          className="px-2 h-6 rounded text-xs bg-slate-800/80 text-white hover:bg-slate-800"
          onClick={copyCode}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
        {/* Line number toggle removed */}
      </div>

      {open && (
        <div
          className="absolute right-2 top-10 z-20 w-56 rounded-md border bg-white dark:bg-slate-800 shadow-lg p-1 text-sm"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="p-1">
            <input
              autoFocus
              placeholder="Search language"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-2 py-1 rounded border bg-transparent text-sm"
            />
          </div>
          <div className="max-h-64 overflow-auto">
            {recentLangs.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs text-slate-500">Recent</div>
                {recentLangs.map((lang) => (
                  <button
                    key={`recent-${lang}`}
                    className={["w-full text-left px-2 py-1 rounded", current === lang ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-700"].join(' ')}
                    onClick={() => applyLanguage(normalizeLanguage(lang, all))}
                  >
                    {lang}
                  </button>
                ))}
                <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
              </>
            )}
            <button
              className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => applyLanguage(null)}
            >
              Plain text
            </button>
            {filtered.map((lang) => (
              <button
                key={lang}
                className={["w-full text-left px-2 py-1 rounded", current === lang ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-700"].join(' ')}
                onClick={() => applyLanguage(normalizeLanguage(lang, all))}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="codeblock-grid">
        <pre ref={contentRef} className="codeblock-pre">
          <NodeViewContent className="hljs" />
        </pre>
      </div>
    </NodeViewWrapper>
  )
}

export const CodeBlockWithActions = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView)
  },
})

export default CodeBlockWithActions
