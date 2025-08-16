import { useEffect, useState } from 'react';
import { firebaseAuthService } from '@/common/services/firebase/firebase-auth.service';
import { User } from 'firebase/auth';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 监听认证状态变化
    const unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // 清理订阅
    return () => unsubscribe();
  }, []);

  return { user, loading };
};