import { create } from "zustand";
import { User } from "firebase/auth";
import { firebaseAuthService } from "@/common/services/firebase/firebase-auth.service";
import { firebaseConfig } from "@/common/config/firebase.config";
import { AuthStep, AuthMessage, AuthProgress } from "@/common/types/auth.types";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { hasGuestWorkspace } from "@/core/services/guest-id";

export interface AuthState {
  currentUser: User | null;
  authIsReady: boolean;
  authIsSettled: boolean;
  isInitializing: boolean;
  isRefreshing: boolean;
  isAuthenticating: boolean;
  authStep: AuthStep;
  authMessage: string;
  authProgress: number;

  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ user: User; verificationSent: boolean }>;
  sendSignUpLink: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<{ verificationSent: boolean }>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  setAuth: (user: User | null) => void;
  setAuthReady: (ready: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setAuthenticating: (authenticating: boolean) => void;
  setAuthStep: (step: AuthStep, message: string, progress: number) => void;
  initAuthListener: () => Promise<() => void>;
}

type AuthListenerSingleton = {
  started: boolean;
  unsubscribe: (() => void) | null;
};

function getAuthListenerSingleton(): AuthListenerSingleton {
  const key = "__echonote_auth_listener_singleton__";
  const g = globalThis as unknown as Record<string, AuthListenerSingleton | undefined>;
  if (!g[key]) {
    g[key] = { started: false, unsubscribe: null };
  }
  return g[key]!;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null,
  authIsReady: false,
  authIsSettled: false,
  isInitializing: false,
  isRefreshing: false,
  isAuthenticating: false,
  authStep: AuthStep.IDLE,
  authMessage: "",
  authProgress: 0,

  signInWithGoogle: async () => {
    if (!firebaseConfig.supportGoogleAuth()) {
      throw new Error("Google authentication is not supported in this region");
    }
    set({
      isAuthenticating: true,
      authStep: AuthStep.AUTHENTICATING,
      authMessage: AuthMessage.CONNECTING_GOOGLE,
      authProgress: AuthProgress.AUTHENTICATING,
    });
    try {
      await firebaseAuthService.signInWithGoogle();
      set({
        authStep: AuthStep.INITIALIZING_DATA,
        authMessage: AuthMessage.SETTING_UP_WORKSPACE,
        authProgress: AuthProgress.INITIALIZING_DATA,
      });
    } catch (error) {
      set({
        authStep: AuthStep.ERROR,
        authMessage: AuthMessage.SIGN_IN_FAILED,
        authProgress: AuthProgress.START,
      });
      throw error;
    } finally {
      set({ isAuthenticating: false });
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({
      isAuthenticating: true,
      authStep: AuthStep.AUTHENTICATING,
      authMessage: AuthMessage.VERIFYING_CREDENTIALS,
      authProgress: AuthProgress.AUTHENTICATING,
    });
    try {
      await firebaseAuthService.signInWithEmail(email, password);
      set({
        authStep: AuthStep.VERIFYING_EMAIL,
        authMessage: AuthMessage.CHECKING_EMAIL_VERIFICATION,
        authProgress: AuthProgress.VERIFYING_EMAIL,
      });
    } catch (error) {
      set({
        authStep: AuthStep.ERROR,
        authMessage: AuthMessage.CHECK_CREDENTIALS,
        authProgress: AuthProgress.START,
      });
      throw error;
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
        throw new Error("No user logged in");
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
      useNotesDataStore.getState().cleanupListeners();
    } finally {
      set({ isAuthenticating: false });
    }
  },

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

  setAuthStep: (step: AuthStep, message: string, progress: number) => {
    set({ authStep: step, authMessage: message, authProgress: progress });
  },

  initAuthListener: async () => {
    const singleton = getAuthListenerSingleton();
    if (singleton.started) {
      // In React 18 StrictMode/dev, effects can mount/unmount twice. Starting multiple listeners
      // causes global store churn (channelsLoading/userId toggles) and UI flicker.
      return () => {};
    }
    singleton.started = true;

    // Reset readiness/settling every boot. We rely on Firebase for persistence.
    set({
      authIsReady: false,
      authIsSettled: false,
      isInitializing: true,
      isRefreshing: false,
    });

    // Avoid a transient "empty channels" UI between app boot and auth resolution.
    // We keep the channels list in a loading state until auth is settled.
    useNotesDataStore.getState().cleanupListeners();
    useNotesDataStore.getState().setChannelsLoading(true);

    try {
      const unsubscribe = await firebaseAuthService.onAuthStateChanged(user => {
        get().setAuth(user);
        set({ authIsReady: true, isInitializing: false, isRefreshing: false });

        // Verified user -> use cloud workspace immediately.
        if (user && user.emailVerified) {
          firebaseConfig.setUserIdForAnalytics(user.uid);
          void useNotesDataStore
            .getState()
            .initFirebaseListeners(user.uid)
            .catch(err => {
              console.error("[auth] init firebase listeners failed", err);
              useNotesDataStore.getState().cleanupListeners();
            })
            .finally(() => {
              set({ authIsSettled: true });
            });
          return;
        }

        // Logged-out (or unverified) users: enter local automatically if a guest workspace exists.
        if (hasGuestWorkspace()) {
          void useNotesDataStore
            .getState()
            .initGuestWorkspace()
            .catch(err => {
              console.error("[auth] init guest workspace failed", err);
              useNotesDataStore.getState().cleanupListeners();
            })
            .finally(() => set({ authIsSettled: true }));
          return;
        }

        useNotesDataStore.getState().cleanupListeners();
        set({ authIsSettled: true });
      });

      singleton.unsubscribe = unsubscribe;
      return () => {};
    } catch (err) {
      singleton.started = false;
      singleton.unsubscribe = null;
      throw err;
    }
  },
}));
