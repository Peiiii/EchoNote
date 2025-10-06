import { useEffect } from 'react';
import { useAuthStore } from '@/core/stores/auth.store';

export const useFirebaseAuth = () => {
  const {
    currentUser,
    isInitializing,
    isRefreshing,
    initAuthListener
  } = useAuthStore();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const setupListener = async () => {
      unsubscribe = await initAuthListener();
    };
    
    setupListener();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initAuthListener]);

  return {
    user: currentUser,
    isInitializing,
    isRefreshing,
  };
};