/**
 * Computes the ID of the message that is currently focused (closest to container center)
 * Uses geometric distance calculation to find the most centered visible message
 * @param container - The scrollable container element
 * @returns The ID of the focused message, or null if none found
 */
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

/**
 * Collapses a message element with intelligent scroll behavior
 * If the element's top was not visible before collapse, scrolls to align it with container top
 * @param params - Configuration object for the collapse operation
 * @param params.container - The scrollable container element
 * @param params.element - The message element to collapse
 * @param params.topVisibleBefore - Whether the element's top was visible before collapse
 * @param params.onCollapse - Callback function to trigger the actual collapse
 */
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

/**
 * Gets the floating offset value for collapse button positioning
 * Reads from CSS custom property --collapse-float-offset or returns default value
 * @param container - The container element to read CSS properties from
 * @returns The floating offset value in pixels (default: 8)
 */
export function getFloatOffset(container: HTMLElement | null): number {
  if (!container) return 8
  const cs = getComputedStyle(container)
  const v = cs.getPropertyValue('--collapse-float-offset')
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 8
}
