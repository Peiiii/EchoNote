import { useBreakpoint } from "@/common/components/breakpoint-provider";
import { DesktopApp } from "@/desktop/desktop-app";
import { MobileApp } from "@/mobile/mobile-app";


export const App = () => {
  const { isMobile } = useBreakpoint();
  return isMobile ? <MobileApp /> : <DesktopApp />;
};