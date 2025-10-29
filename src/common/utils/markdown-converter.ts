import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { marked } from 'marked'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import rehypeTableNormalize from '@/common/markdown/plugins/rehype-table-normalize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkStringify from 'remark-stringify'

// Configure marked for basic GFM support
marked.setOptions({
  gfm: true,
  breaks: false,
})

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})

// Enable GitHub-flavored Markdown conversion (tables, strikethrough, task list)
td.use(gfm)

// Normalize GFM task list HTML (from marked) into TipTap's task HTML
function normalizeGfmTasksToTiptap(html: string): string {
  if (typeof window === 'undefined' || !html || html.indexOf('type="checkbox"') === -1) return html
  try {
    const doc = document.implementation.createHTMLDocument('')
    const container = doc.createElement('div')
    container.innerHTML = html

    // Mark any UL that contains a checkbox LI as a task list and normalize each LI
    Array.from(container.querySelectorAll('ul')).forEach((ul) => {
      const lis = Array.from(ul.querySelectorAll(':scope > li'))
      const hasCheckbox = lis.some((li) => li.querySelector('input[type="checkbox"]'))
      if (!hasCheckbox) return
      ul.setAttribute('data-type', 'taskList')

      lis.forEach((li) => {
        const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement | null
        if (!checkbox) return

        const checked = checkbox.checked || checkbox.hasAttribute('checked')

        // Collect original children and remove checkbox from its original place
        const originalChildren = Array.from(li.childNodes)
        if (checkbox.parentElement) checkbox.parentElement.removeChild(checkbox)

        // Build TipTap task item DOM
        li.innerHTML = ''
        li.setAttribute('data-type', 'taskItem')
        li.setAttribute('data-checked', checked ? 'true' : 'false')

        const label = doc.createElement('label')
        label.setAttribute('contenteditable', 'false')
        // Append checkbox then a span (cursor target)
        label.appendChild(checkbox)
        const span = doc.createElement('span')
        label.appendChild(span)
        li.appendChild(label)

        const contentDiv = doc.createElement('div')
        contentDiv.setAttribute('class', 'content')

        // Determine if there are any block elements in original content
        const nodesWithoutCheckbox = originalChildren.filter((n) => n !== checkbox)
        const hasBlock = nodesWithoutCheckbox.some(
          (n) => n.nodeType === 1 && /^(P|UL|OL|DIV|H[1-6]|BLOCKQUOTE|PRE|TABLE)$/i.test((n as Element).tagName)
        )

        if (hasBlock) {
          nodesWithoutCheckbox.forEach((n) => {
            if (n.nodeType === 3 && !n.textContent?.trim()) return // skip pure whitespace
            contentDiv.appendChild(n.cloneNode(true))
          })
        } else {
          // Wrap inline/text into a paragraph to satisfy TipTap taskItem schema
          const p = doc.createElement('p')
          nodesWithoutCheckbox.forEach((n) => {
            if (n.nodeType === 3 && !n.textContent?.trim()) return
            p.appendChild(n.cloneNode(true))
          })
          if (!p.firstChild) p.appendChild(doc.createTextNode(''))
          contentDiv.appendChild(p)
        }

        li.appendChild(contentDiv)
      })
    })

    return container.innerHTML
  } catch {
    return html
  }
}

// Normalize TipTap task HTML into GFM-compatible HTML so Turndown can emit - [ ]
function normalizeTiptapTasksToGfm(html: string): string {
  if (typeof window === 'undefined' || !html || html.indexOf('data-type="taskList"') === -1) return html
  try {
    const doc = document.implementation.createHTMLDocument('')
    const container = doc.createElement('div')
    container.innerHTML = html

    container.querySelectorAll('ul[data-type="taskList"]').forEach((ul) => {
      ul.classList.add('contains-task-list')
      ul.querySelectorAll(':scope > li').forEach((li) => {
        const checkedAttr = li.getAttribute('data-checked')
        const checked = checkedAttr === 'true' || checkedAttr === 'checked'
        const label = (li as HTMLElement).querySelector(':scope > label')
        const contentDiv = (li as HTMLElement).querySelector(':scope > div.content') ||
          (li as HTMLElement).querySelector(':scope > div')

        // Build GFM-like structure
        const checkbox = doc.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.setAttribute('aria-label', 'Task item')
        checkbox.setAttribute('disabled', 'true')
        if (checked) checkbox.setAttribute('checked', 'true')

        // Reset li and move content nodes safely (avoid wrapping block nodes in span)
        li.removeAttribute('data-checked')
        if (label) label.remove()
        const nodesToMove: Node[] = []
        if (contentDiv) {
          while (contentDiv.firstChild) {
            nodesToMove.push(contentDiv.firstChild)
            contentDiv.removeChild(contentDiv.firstChild)
          }
          contentDiv.remove()
        }
        // If contentDiv not found (edge cases), gather remaining li children except input if any
        if (!nodesToMove.length) {
          Array.from(li.childNodes).forEach((n) => {
            // skip any inputs that may remain
            if (n.nodeType === 1 && (n as Element).tagName === 'INPUT') return
            nodesToMove.push(n.cloneNode(true))
          })
        }

        li.classList.add('task-list-item')
        li.innerHTML = ''
        li.appendChild(checkbox)
        li.appendChild(doc.createTextNode(' '))
        // Append actual content nodes directly under li (preserve <p>, inline, etc.)
        nodesToMove.forEach((n) => {
          if (n.nodeType === 1 && (n as Element).tagName === 'P') {
            // Unwrap paragraph to keep content inline after the checkbox
            const p = n as Element
            while (p.firstChild) li.appendChild(p.firstChild)
          } else if (n.nodeType === 3 && !n.textContent?.trim()) {
            // skip pure whitespace to avoid empty lines
            return
          } else {
            li.appendChild(n)
          }
        })
      })
      ul.removeAttribute('data-type')
    })

    return container.innerHTML
  } catch {
    return html
  }
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  try {
    // marked.parse returns string in modern versions
    const raw = marked.parse(markdown) as string
    const normalized = normalizeGfmTasksToTiptap(raw)
    return normalized
  } catch {
    return markdown
  }
}

export function htmlToMarkdown(html: string): string {
  if (!html) return ''
  try {
    // Step 1: TipTap tasks → GFM-friendly HTML
    const normalizedTasks = normalizeTiptapTasksToGfm(html)

    // Step 3: HTML → Markdown via unified (rehype → remark → stringify)
    const file = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeTableNormalize)
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkStringify, {
        fences: true,
        bullet: '-',
        rule: '-',
        listItemIndent: 'one',
        // Keep tables tidy for readability while avoiding layout issues
        fencesMinGap: 1,
      } as any)
      .processSync(normalizedTasks)

    return String(file.value)
  } catch {
    return html
  }
}

export function markdownToPreviewText(markdown: string, maxLength = 120): string {
  if (!markdown) return ''
  try {
    const html = markdownToHtml(markdown)
    // Naive HTML tag strip
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 1) + '…'
  } catch {
    // eslint-disable-next-line no-useless-escape
    const text = markdown.replace(/[`*_>#\-\[\]()]+/g, ' ').replace(/\s+/g, ' ').trim()
    return text.length <= maxLength ? text : text.slice(0, maxLength - 1) + '…'
  }
}

export function isMarkdownContent(content: string): boolean {
  if (!content) return false
  // Heuristic: presence of common markdown syntax
  return /(^|\s)([#>*\-+]|\d+\.)\s|`{1,3}|\*{1,3}|_{1,3}|\[.+?\]\(.+?\)/.test(content)
}
