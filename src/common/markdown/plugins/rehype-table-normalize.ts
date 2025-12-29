import type { Root, Element, Properties, Content, RootContent, ElementContent } from 'hast'
import { visit, EXIT } from 'unist-util-visit'

type Options = {
  flattenCells?: boolean
  forceHeader?: boolean
}

// Narrow to HAST element node (optionally with tag)
function isElementNode(node: Content | RootContent | null | undefined, tag?: string): node is Element {
  if (!node) return false
  const el = node as Partial<Element>
  if (el.type !== 'element') return false
  return tag ? el.tagName === tag : true
}

function parseTextAlign(style?: string): 'left' | 'center' | 'right' | undefined {
  if (!style) return undefined
  const m = /text-align\s*:\s*(left|center|right)/i.exec(style)
  if (!m) return undefined
  const v = m[1].toLowerCase()
  if (v === 'left' || v === 'center' || v === 'right') return v
  return undefined
}

function hasComplexSpan(node: Element): boolean {
  let complex = false
  visit(node, 'element', (n) => {
    if (!isElementNode(n)) return
    const el = n as Element
    if (el.tagName === 'th' || el.tagName === 'td') {
      const p = (el.properties || {}) as Properties & { colspan?: string | number | undefined; rowspan?: string | number | undefined }
      const cs = parseInt((p.colspan as string) || '1', 10)
      const rs = parseInt((p.rowspan as string) || '1', 10)
      if ((Number.isFinite(cs) ? cs : 1) > 1 || (Number.isFinite(rs) ? rs : 1) > 1) {
        complex = true
        return EXIT
      }
    }
    return undefined
  })
  return complex
}

function unwrapTopLevelP(cell: Element) {
  const children = cell.children as ElementContent[]
  for (let i = 0; i < children.length; i++) {
    const ch = children[i]
    if (isElementNode(ch, 'p')) {
      // Replace the <p> with its children
      const pKids = (ch.children || []) as ElementContent[]
      // Remove the <p>
      children.splice(i, 1, ...pKids)
      // Adjust index to continue after the unwrapped content
      i += pKids.length - 1
    }
  }
}

export default function rehypeTableNormalize(options: Options = {}) {
  const { flattenCells = true, forceHeader = true } = options

  return function transformer(tree: Root) {
    visit(tree, 'element', (n) => {
      if (!isElementNode(n, 'table')) return
      const table = n as Element

      // Skip truly complex tables (row/col span > 1)
      if (hasComplexSpan(table)) return

      // Find existing sections
      const kids = table.children as ElementContent[]
      const theadIdx = kids.findIndex((c) => isElementNode(c, 'thead'))
      const tbodyIdx = kids.findIndex((c) => isElementNode(c, 'tbody'))

      // Helper to get first <tr> under thead/tbody/directly
      const firstTrFrom = (el?: Element): Element | undefined => {
        if (!el) return undefined
        const k = (el.children || []) as ElementContent[]
        const found = k.find((c) => isElementNode(c, 'tr'))
        return found as Element | undefined
      }

      const firstTrDirect = kids.find((c) => isElementNode(c, 'tr')) as Element | undefined
      const thead = theadIdx >= 0 ? (kids[theadIdx] as Element) : undefined
      const tbody = tbodyIdx >= 0 ? (kids[tbodyIdx] as Element) : undefined

      let firstRow: Element | undefined = firstTrFrom(thead) || firstTrFrom(tbody) || firstTrDirect
      if (!firstRow) return

      // Determine if it's already a heading row (thead or all THs in first row)
      const parentOfRow: Element = (thead && firstRow && firstRow === firstTrFrom(thead))
        ? thead
        : (tbody && firstRow && firstRow === firstTrFrom(tbody))
          ? tbody
          : table

      const allTh = (firstRow.children || []).every((c) => isElementNode(c as ElementContent, 'th'))
      const isInThead = parentOfRow && isElementNode(parentOfRow, 'thead')
      const alreadyHeading = isInThead || allTh

      if (forceHeader && !alreadyHeading) {
        // Clone row to THEAD header row
        const headerRow: Element = {
          type: 'element',
          tagName: 'tr',
          properties: {},
          children: (firstRow.children || []).map((cell): Element => {
            const c = cell as Element
            if (!isElementNode(c)) return c
            const style = (c.properties?.style as string) || ''
            const align = parseTextAlign(style)
            return {
              type: 'element',
              tagName: 'th',
              properties: align ? { align } : {},
              children: (c.children || []) as ElementContent[],
            }
          }) as ElementContent[],
        }

        const theadEl: Element = { type: 'element', tagName: 'thead', properties: {}, children: [headerRow] }

        // Insert THEAD after CAPTION/COLGROUP and before TBODY/TR/TFOOT
        let insertAt = kids.findIndex((c) => isElementNode(c, 'tbody') || isElementNode(c, 'tr') || isElementNode(c, 'tfoot'))
        if (insertAt === -1) insertAt = kids.length
        ;(table.children as ElementContent[]).splice(insertAt, 0, theadEl)

        // Remove original firstRow from whichever section it currently resides in
        const containers: Element[] = [table]
        if (thead) containers.unshift(thead)
        if (tbody) containers.unshift(tbody)
        for (const cont of containers) {
          const arr = (cont.children || []) as ElementContent[]
          const idx = arr.indexOf(firstRow as unknown as ElementContent)
          if (idx >= 0) {
            arr.splice(idx, 1)
            break
          }
        }

        // Update local refs
        firstRow = headerRow
      }

      if (flattenCells) {
        // Unwrap top-level <p> in all th/td cells and collapse whitespace by relying on stringify
        visit(table, 'element', (m) => {
          if (!isElementNode(m)) return
          const el = m as Element
          if (el.tagName === 'th' || el.tagName === 'td') unwrapTopLevelP(el)
        })
      }
    })
  }
}
