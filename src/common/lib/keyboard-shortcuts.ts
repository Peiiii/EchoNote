/**
 * Cross-platform keyboard shortcut utilities
 */

/**
 * Check if the current platform is Mac
 */
export const isMac = () => {
  return navigator.platform.toUpperCase().includes('MAC');
};

/**
 * Check if either Cmd (Mac) or Ctrl (Windows/Linux) modifier key is pressed
 * @param event - Keyboard event
 * @returns true if either modifier key is pressed
 */
export const isModifierKeyPressed = (event: KeyboardEvent | React.KeyboardEvent): boolean => {
  return event.metaKey || event.ctrlKey;
};

/**
 * Get the display text for the modifier key
 * @returns The display symbol for the modifier key
 */
export const getModifierKeySymbol = (): string => {
  return isMac() ? '⌘' : 'Ctrl';
};

/**
 * Get cross-platform keyboard shortcut text showing both Mac and Windows/Linux
 * @param key - The key to combine with modifier
 * @returns Formatted shortcut text showing both platforms
 */
export const getShortcutText = (key: string): string => {
  return `⌘+${key} / Ctrl+${key}`;
};

/**
 * Common keyboard shortcuts
 */
export const SHORTCUTS = {
  SEND: getShortcutText('Enter'),
  SAVE: getShortcutText('Enter'),
  CANCEL: 'Esc',
  SEARCH: getShortcutText('K'),
} as const;
