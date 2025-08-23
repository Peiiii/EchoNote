import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Application breakpoint configuration
 * Mobile-first approach with higher mobile threshold for development
 */
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

interface BreakpointContextType {
  currentBreakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const BreakpointContext = createContext<BreakpointContextType | undefined>(undefined);

export function BreakpointProvider({ children }: { children: React.ReactNode }) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const value: BreakpointContextType = {
    currentBreakpoint,
    // 移动端：小于768px（包括手机和平板竖屏）
    isMobile: currentBreakpoint === 'sm' || currentBreakpoint === 'md',
    // 平板横屏：1024px以下，768px以上
    isTablet: currentBreakpoint === 'lg',
    // 桌面端：1280px以上
    isDesktop: currentBreakpoint === 'xl' || currentBreakpoint === '2xl',
  };

  return (
    <BreakpointContext.Provider value={value}>
      {children}
    </BreakpointContext.Provider>
  );
}

export function useBreakpoint() {
  const context = useContext(BreakpointContext);
  if (context === undefined) {
    throw new Error('useBreakpoint must be used within a BreakpointProvider');
  }
  return context;
}