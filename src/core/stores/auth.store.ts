import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { firebaseAuthService } from '@/common/services/firebase/firebase-auth.service';
import { firebaseConfig } from '@/common/config/firebase.config';

export interface AuthState {
  currentUser: User | null;
  authIsReady: boolean;
  
  // 三个核心状态
  isInitializing: boolean;    // 首次初始化（无缓存）
  isRefreshing: boolean;      // 有缓存，正在刷新
  isAuthenticating: boolean;  // 正在登录/登出
  
  // 公共方法
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ user: User; verificationSent: boolean }>;
  sendSignUpLink: (email: string, password: string, displayName?: string) => Promise<{ verificationSent: boolean }>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // 内部状态管理
  setAuth: (user: User | null) => void;
  setAuthReady: (ready: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setAuthenticating: (authenticating: boolean) => void;
  
  // 初始化认证监听器
  initAuthListener: () => Promise<() => void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentUser: null,
      authIsReady: false,
      isInitializing: false,
      isRefreshing: false,
      isAuthenticating: false,

      signInWithGoogle: async () => {
        if (!firebaseConfig.supportGoogleAuth()) {
          throw new Error('Google authentication is not supported in this region');
        }
        set({ isAuthenticating: true });
        try {
          await firebaseAuthService.signInWithGoogle();
        } finally {
          set({ isAuthenticating: false });
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        set({ isAuthenticating: true });
        try {
          await firebaseAuthService.signInWithEmail(email, password);
        } finally {
          set({ isAuthenticating: false });
        }
      },

      signUpWithEmail: async (email: string, password: string, displayName?: string) => {
        set({ isAuthenticating: true });
        try {
          const result = await firebaseAuthService.signUpWithEmail(email, password, displayName);
          return result;
        } finally {
          set({ isAuthenticating: false });
        }
      },

      sendSignUpLink: async (email: string, password: string, displayName?: string) => {
        set({ isAuthenticating: true });
        try {
          const result = await firebaseAuthService.sendSignUpLink(email, password, displayName);
          return result;
        } finally {
          set({ isAuthenticating: false });
        }
      },


      sendPasswordReset: async (email: string) => {
        set({ isAuthenticating: true });
        try {
          await firebaseAuthService.sendPasswordReset(email);
        } finally {
          set({ isAuthenticating: false });
        }
      },

      sendEmailVerification: async () => {
        set({ isAuthenticating: true });
        try {
          const user = get().currentUser;
          if (!user) {
            throw new Error('No user logged in');
          }
          await firebaseAuthService.sendEmailVerification(user);
        } finally {
          set({ isAuthenticating: false });
        }
      },

      signOut: async () => {
        set({ isAuthenticating: true });
        try {
          await firebaseAuthService.signOut();
        } finally {
          set({ isAuthenticating: false });
        }
      },

      // 内部状态管理
      setAuth: (user: User | null) => {
        set({ currentUser: user });
      },

      setAuthReady: (ready: boolean) => {
        set({ authIsReady: ready });
      },

      setInitializing: (initializing: boolean) => {
        set({ isInitializing: initializing });
      },

      setRefreshing: (refreshing: boolean) => {
        set({ isRefreshing: refreshing });
      },

      setAuthenticating: (authenticating: boolean) => {
        set({ isAuthenticating: authenticating });
      },

      // 初始化认证监听器
      initAuthListener: async () => {
        // 检查是否有缓存数据
        const hasCachedUser = get().currentUser !== null;
        
        if (hasCachedUser) {
          // 有缓存数据，设置为刷新状态
          set({ isRefreshing: true, authIsReady: false });
        } else {
          // 无缓存数据，设置为初始化状态
          set({ isInitializing: true, authIsReady: false });
        }

        const unsubscribe = await firebaseAuthService.onAuthStateChanged((user) => {
          // 更新用户状态
          get().setAuth(user);
          
          // 根据之前的状态设置相应的加载状态
          if (hasCachedUser) {
            // 有缓存数据，刷新完成
            set({ isRefreshing: false, authIsReady: true });
          } else {
            // 无缓存数据，初始化完成
            set({ isInitializing: false, authIsReady: true });
          }
        });

        return unsubscribe;
      },
    }),
    {
      name: "echonote-auth-storage",
      partialize: (state) => ({ 
        currentUser: state.currentUser, 
        authIsReady: state.authIsReady 
      })
    }
  )
);
