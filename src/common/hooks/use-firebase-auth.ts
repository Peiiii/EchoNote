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
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  return {
    user: currentUser,
    isInitializing,
    isRefreshing,
  };
};