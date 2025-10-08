/**
 * Breakpoint utilities for consistent breakpoint detection across the application
 * This should be the single source of truth for breakpoint logic
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get current breakpoint based on window width
 * This replicates the exact logic from BreakpointProvider
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') return 'sm';
  
  const width = window.innerWidth;
  
  if (width >= breakpoints['2xl']) {
    return '2xl';
  } else if (width >= breakpoints.xl) {
    return 'xl';
  } else if (width >= breakpoints.lg) {
    return 'lg';
  } else if (width >= breakpoints.md) {
    return 'md';
  } else {
    return 'sm';
  }
};

/**
 * Check if current viewport is mobile
 * Mobile: sm or md breakpoints (consistent with BreakpointProvider)
 */
export const isMobile = (): boolean => {
  const currentBreakpoint = getCurrentBreakpoint();
  return currentBreakpoint === 'sm' || currentBreakpoint === 'md';
};

/**
 * Check if current viewport is tablet
 * Tablet: lg breakpoint (consistent with BreakpointProvider)
 */
export const isTablet = (): boolean => {
  const currentBreakpoint = getCurrentBreakpoint();
  return currentBreakpoint === 'lg';
};

/**
 * Check if current viewport is desktop
 * Desktop: xl or 2xl breakpoints (consistent with BreakpointProvider)
 */
export const isDesktop = (): boolean => {
  const currentBreakpoint = getCurrentBreakpoint();
  return currentBreakpoint === 'xl' || currentBreakpoint === '2xl';
};
