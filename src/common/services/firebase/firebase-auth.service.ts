import { auth } from '@/common/config/firebase.config';
import { useChatDataStore } from '@/core/stores/chat-data.store';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User
} from 'firebase/auth';

export const firebaseAuthService = {

  // Google登录
  signInWithGoogle: async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // 初始化数据监听器
      await useChatDataStore.getState().initFirebaseListeners(result.user.uid);
      return result.user; // 返回用户对象
    } catch (error) {
      // 处理错误，例如用户关闭了弹窗
      console.error("Google Sign-In Error:", error);
      return null;
    }
  },

  // 登出
  signOut: async (): Promise<void> => {
    await signOut(auth);
    // 清理数据监听器
    useChatDataStore.getState().cleanupListeners();
  },

  // 监听认证状态变化
  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 用户已登录，初始化数据监听器
        await useChatDataStore.getState().initFirebaseListeners(user.uid);
      } else {
        // 用户未登录，清理数据监听器
        useChatDataStore.getState().cleanupListeners();
      }
      callback(user);
    });
  },

  // 获取当前用户
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },
};
