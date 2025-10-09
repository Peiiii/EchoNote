import { createContext, useContext, useEffect, useState } from "react";
import {
  type Breakpoint,
  getCurrentBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
} from "@/common/lib/breakpoint-utils";

interface BreakpointContextType {
  currentBreakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const BreakpointContext = createContext<BreakpointContextType | undefined>(undefined);

export function BreakpointProvider({ children }: { children: React.ReactNode }) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("sm");

  useEffect(() => {
    const updateBreakpoint = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  const value: BreakpointContextType = {
    currentBreakpoint,
    // Use the utility functions for consistency
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
  };

  return <BreakpointContext.Provider value={value}>{children}</BreakpointContext.Provider>;
}

export function useBreakpoint() {
  const context = useContext(BreakpointContext);
  if (context === undefined) {
    throw new Error("useBreakpoint must be used within a BreakpointProvider");
  }
  return context;
}
