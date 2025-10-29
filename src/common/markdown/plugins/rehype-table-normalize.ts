import type { Root, Element, Properties, Content } from 'hast'
import { visit, EXIT } from 'unist-util-visit'

type Options = {
  flattenCells?: boolean
  forceHeader?: boolean
}

const isElement = (node: any, tag?: string): node is Element =>
  node && node.type === 'element' && (!tag || node.tagName === tag)

function parseTextAlign(style?: string): 'left' | 'center' | 'right' | undefined {
  if (!style) return undefined
  const m = /text-align\s*:\s*(left|center|right)/i.exec(style)
  return (m ? m[1].toLowerCase() : undefined) as any
}

function hasComplexSpan(node: Element): boolean {
  let complex = false
  visit(node, 'element', (n: Element) => {
    if (n.tagName === 'th' || n.tagName === 'td') {
      const p = (n.properties || {}) as Properties & { colspan?: any; rowspan?: any }
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
  const children = cell.children as any[]
  for (let i = 0; i < children.length; i++) {
    const ch = children[i]
    if (isElement(ch, 'p')) {
      // Replace the <p> with its children
      const pKids = (ch.children || []) as Content[]
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
    visit(tree, 'element', (table: Element) => {
      if (!isElement(table, 'table')) return

      // Skip truly complex tables (row/col span > 1)
      if (hasComplexSpan(table)) return

      // Find existing sections
      const kids = table.children as any[]
      const theadIdx = kids.findIndex((c) => isElement(c, 'thead'))
      const tbodyIdx = kids.findIndex((c) => isElement(c, 'tbody'))

      // Helper to get first <tr> under thead/tbody/directly
      const firstTrFrom = (el?: any): any | undefined => {
        if (!el) return undefined
        const k = (el.children || []) as any[]
        return k.find((c) => isElement(c, 'tr'))
      }

      const firstTrDirect = kids.find((c) => isElement(c, 'tr'))
      const thead = theadIdx >= 0 ? (kids[theadIdx] as Element) : undefined
      const tbody = tbodyIdx >= 0 ? (kids[tbodyIdx] as Element) : undefined

      let firstRow: Element | undefined = firstTrFrom(thead) || firstTrFrom(tbody) || firstTrDirect
      if (!firstRow) return

      // Determine if it's already a heading row (thead or all THs in first row)
      const parentOfRow: any = (thead && firstRow && firstRow === firstTrFrom(thead))
        ? thead
        : (tbody && firstRow && firstRow === firstTrFrom(tbody))
          ? tbody
          : table

      const allTh = (firstRow.children || []).every((c: any) => isElement(c, 'th'))
      const isInThead = parentOfRow && isElement(parentOfRow, 'thead')
      const alreadyHeading = isInThead || allTh

      if (forceHeader && !alreadyHeading) {
        // Clone row to THEAD header row
        const headerRow: Element = {
          type: 'element',
          tagName: 'tr',
          properties: {},
          children: (firstRow.children || []).map((cell: any): Element => {
            if (!isElement(cell)) return cell
            const style = (cell.properties?.style as string) || ''
            const align = parseTextAlign(style)
            return {
              type: 'element',
              tagName: 'th',
              properties: align ? { align } : {},
              children: (cell.children || []) as any[],
            }
          }) as any,
        }

        const theadEl: Element = { type: 'element', tagName: 'thead', properties: {}, children: [headerRow] }

        // Insert THEAD after CAPTION/COLGROUP and before TBODY/TR/TFOOT
        let insertAt = kids.findIndex((c) => isElement(c, 'tbody') || isElement(c, 'tr') || isElement(c, 'tfoot'))
        if (insertAt === -1) insertAt = kids.length
        kids.splice(insertAt, 0, theadEl)

        // Remove original firstRow from its parent
        const parentKids = (parentOfRow.children || []) as any[]
        const rowIdx = parentKids.indexOf(firstRow)
        if (rowIdx >= 0) parentKids.splice(rowIdx, 1)

        // Update local refs
        firstRow = headerRow
      }

      if (flattenCells) {
        // Unwrap top-level <p> in all th/td cells and collapse whitespace by relying on stringify
        visit(table, 'element', (n: Element) => {
          if (n.tagName === 'th' || n.tagName === 'td') unwrapTopLevelP(n)
        })
      }
    })
  }
}
