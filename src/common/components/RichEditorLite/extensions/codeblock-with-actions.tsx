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
  const [showLn, setShowLn] = useState(false)
  const [lineCount, setLineCount] = useState(1)
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
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  // Track line count for optional line numbers
  React.useEffect(() => {
    const update = () => {
      const text = contentRef.current?.textContent || ''
      const count = text.length ? text.split('\n').length : 1
      setLineCount(count)
    }
    update()
    const mo = new MutationObserver(update)
    if (contentRef.current) mo.observe(contentRef.current, { childList: true, characterData: true, subtree: true })
    return () => mo.disconnect()
  }, [])

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
        <button
          type="button"
          className="px-2 h-6 rounded text-xs bg-slate-800/80 text-white hover:bg-slate-800"
          onClick={() => setShowLn((v) => !v)}
        >
          {showLn ? 'No Ln' : 'Ln'}
        </button>
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

      {showLn && (
        <ol className="codeblock-ln">
          {Array.from({ length: lineCount }).map((_, i) => (
            <li key={i}>{i + 1}</li>
          ))}
        </ol>
      )}
      <pre ref={contentRef} style={{ paddingLeft: showLn ? '2.5rem' as string : undefined }}>
        <NodeViewContent className="hljs" />
      </pre>
    </NodeViewWrapper>
  )
}

export const CodeBlockWithActions = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView)
  },
})

export default CodeBlockWithActions
