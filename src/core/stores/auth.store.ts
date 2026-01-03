import { create } from "zustand";
import { User } from "firebase/auth";
import { firebaseAuthService } from "@/common/services/firebase/firebase-auth.service";
import { firebaseConfig } from "@/common/config/firebase.config";
import { AuthStep, AuthMessage, AuthProgress } from "@/common/types/auth.types";
import { authHint } from "@/common/services/firebase/auth-hint";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { hasGuestWorkspace } from "@/core/services/guest-id";
import { workspaceMode } from "@/core/services/workspace-mode";

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

const AUTH_HINT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
const AUTH_RESTORE_GRACE_MS = 1200;

let pendingRestoreTimer: number | null = null;
let pendingRestoreSeq = 0;

function getFreshAuthHintUid(): string | null {
  const uid = authHint.getLastUid();
  if (!uid) return null;
  const ts = authHint.getLastSetAtMs();
  if (!ts) return uid;
  const age = Date.now() - ts;
  return age <= AUTH_HINT_MAX_AGE_MS ? uid : null;
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
      authHint.clear();
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
    // Reset readiness/settling every boot. We rely on Firebase for persistence.
    set({
      authIsReady: false,
      authIsSettled: false,
      isInitializing: true,
      isRefreshing: false,
    });

    const preferredMode = workspaceMode.get();
    const hintedUid = preferredMode === "cloud" ? getFreshAuthHintUid() : null;

    // Optimistically initialize last signed-in workspace (cloud) without ever falling back to local automatically.
    if (hintedUid && !useNotesDataStore.getState().userId) {
      useNotesDataStore.getState().setChannelsLoading(true);
      void useNotesDataStore
        .getState()
        .initFirebaseListeners(hintedUid)
        .catch(err => {
          console.warn("[auth] optimistic cloud init failed", err);
          useNotesDataStore.getState().cleanupListeners();
        });
    } else if (preferredMode === "local" && hasGuestWorkspace()) {
      void useNotesDataStore.getState().initGuestWorkspace();
    } else {
      // Logged-out and no local workspace selected yet: do not keep skeleton forever.
      useNotesDataStore.getState().cleanupListeners();
    }

    const unsubscribe = await firebaseAuthService.onAuthStateChanged(user => {
      if (pendingRestoreTimer !== null) {
        window.clearTimeout(pendingRestoreTimer);
        pendingRestoreTimer = null;
      }

      get().setAuth(user);
      set({ authIsReady: true, isInitializing: false, isRefreshing: false });

      // Verified user -> use cloud workspace immediately.
      if (user && user.emailVerified) {
        firebaseConfig.setUserIdForAnalytics(user.uid);
        authHint.setLastUid(user.uid);
        workspaceMode.set("cloud");
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

      // Unverified users are treated as logged-out for data purposes.
      if (user && !user.emailVerified) {
        authHint.clear();
        useNotesDataStore.getState().cleanupListeners();
        set({ authIsSettled: true });
        return;
      }

      // No user: if we had a fresh cloud hint, allow a brief restore window, but never auto-enter local.
      const shouldGraceRestore = Boolean(hintedUid);
      if (shouldGraceRestore) {
        pendingRestoreSeq += 1;
        const seq = pendingRestoreSeq;
        set({ authIsSettled: false });
        pendingRestoreTimer = window.setTimeout(async () => {
          if (seq !== pendingRestoreSeq) return;
          const auth = await firebaseConfig.getAuth();
          if (auth.currentUser) return;
          authHint.clear();
          useNotesDataStore.getState().cleanupListeners();
          set({ authIsSettled: true });
        }, AUTH_RESTORE_GRACE_MS);
        return;
      }

      // Logged-out and no cloud hint: resume local only if that was the chosen mode and workspace exists.
      if (workspaceMode.get() === "local" && hasGuestWorkspace()) {
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

    return unsubscribe;
  },
}));
