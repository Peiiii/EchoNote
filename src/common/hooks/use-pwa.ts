import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: Event | null;
}

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as { standalone?: boolean }).standalone === true;
      setPWAState(prev => ({ ...prev, isInstalled: isStandalone || isInApp }));
    };

    // Handle online/offline status
    const handleOnline = () => setPWAState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPWAState(prev => ({ ...prev, isOnline: false }));

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPWAState(prev => ({ ...prev, installPrompt: e }));
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setPWAState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        installPrompt: null 
      }));
    };

    // Handle service worker updates
    const handleSWUpdate = () => {
      setPWAState(prev => ({ ...prev, isUpdateAvailable: true }));
    };

    // Initial check
    checkInstalled();

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          handleSWUpdate();
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!pwaState.installPrompt) return false;

    try {
      const installPrompt = pwaState.installPrompt as unknown as { prompt: () => void; userChoice: Promise<{ outcome: string }> };
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setPWAState(prev => ({ ...prev, installPrompt: null }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to install app:', error);
      return false;
    }
  };

  const updateApp = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
      window.location.reload();
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  };

  return {
    ...pwaState,
    installApp,
    updateApp,
  };
};
