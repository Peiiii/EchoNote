import { usePWA } from '@/common/hooks/use-pwa';
import { Badge } from '@/common/components/ui/badge';
import { WifiOff, RefreshCw } from 'lucide-react';

export const PWAStatusIndicator = () => {
  const { isInstalled, isOnline, isUpdateAvailable } = usePWA();

  // Only show status indicators for important states
  if (isInstalled && isOnline && !isUpdateAvailable) {
    return null; // Don't show anything if everything is good
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex gap-2">
      {!isOnline && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <WifiOff className="h-3 w-3" />
          Offline
        </Badge>
      )}
      
      {isUpdateAvailable && (
        <Badge variant="default" className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          Update Available
        </Badge>
      )}
    </div>
  );
};
