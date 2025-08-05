import { useBreakpointContext } from "@/common/components/breakpoint-provider";
import { DesktopApp } from "@/desktop/desktop-app";
import { MobileApp } from "@/mobile/mobile-app";


export const App = () => {
  const { isMobile } = useBreakpointContext();
  return isMobile ? <MobileApp /> : <DesktopApp />;
};