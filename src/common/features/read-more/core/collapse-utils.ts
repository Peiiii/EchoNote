export function computeFocusedId(container: HTMLElement): string | null {
  const rect = container.getBoundingClientRect()
  const centerY = rect.top + rect.height / 2
  let best: { id: string; dist: number } | null = null
  const nodes = container.querySelectorAll('[data-message-id]')
  nodes.forEach((node) => {
    const r = (node as HTMLElement).getBoundingClientRect()
    if (r.bottom < rect.top || r.top > rect.bottom) return
    const id = (node as HTMLElement).getAttribute('data-message-id')
    if (!id) return
    const d = Math.abs((r.top + r.height / 2) - centerY)
    if (!best || d < best.dist) best = { id, dist: d }
  })
  return best ? (best as { id: string; dist: number }).id : null
}

export function collapseWithScrollTop(params: {
  container: HTMLElement
  element: HTMLElement
  topVisibleBefore: boolean
  onCollapse: () => void
}) {
  const { container, element, topVisibleBefore, onCollapse } = params
  const cRect = container.getBoundingClientRect()
  onCollapse()
  requestAnimationFrame(() => {
    if (!topVisibleBefore) {
      const rAfter = element.getBoundingClientRect()
      const deltaTop = rAfter.top - cRect.top
      container.scrollTop += deltaTop
    }
  })
}
