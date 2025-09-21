const escapeAttrValue = (value: string) => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value)
  }
  return value.replace(/["\\]/g, '\\$&')
}

export const READ_MORE_DATA_ATTRS = {
  messageId: 'data-message-id',
  collapseInlineFor: 'data-collapse-inline-for',
} as const

export const READ_MORE_SELECTORS = {
  message: `[${READ_MORE_DATA_ATTRS.messageId}]`,
  messageById: (id: string) =>
    `[${READ_MORE_DATA_ATTRS.messageId}="${escapeAttrValue(id)}"]`,
  collapseInlineFor: (id: string) =>
    `[${READ_MORE_DATA_ATTRS.collapseInlineFor}="${escapeAttrValue(id)}"]`,
} as const

export const getMessageIdFromElement = (element: Element) =>
  element.getAttribute(READ_MORE_DATA_ATTRS.messageId)

