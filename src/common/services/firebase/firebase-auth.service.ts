import { firebaseConfig } from "@/common/config/firebase.config";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useAuthStore } from "@/core/stores/auth.store";
import { AuthStep, AuthMessage, AuthProgress } from "@/common/types/auth.types";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";

let isRegistering = false;
let isSigningIn = false;
// Ensure we only initialize listeners once per session to prevent duplicate init/flicker
let hasInitializedListeners = false;

export const firebaseAuthService = {
  signInWithGoogle: async (): Promise<User | null> => {
    console.log("[firebaseAuthService] signInWithGoogle");

    if (!firebaseConfig.supportGoogleAuth()) {
      throw new Error("Google authentication is not supported in this region");
    }

    // const GoogleAuthProvider = await import('firebase/auth').then(mod => mod.GoogleAuthProvider);
    // const signInWithPopup = await import('firebase/auth').then(mod => mod.signInWithPopup);
    const provider = new GoogleAuthProvider();
    try {
      // Let onAuthStateChanged handle initialization to avoid double init
      isSigningIn = true;
      const auth = await firebaseConfig.getAuth();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return null;
    }
  },

  sendSignUpLink: async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ verificationSent: boolean }> => {
    try {
      // 设置注册标志，避免界面闪烁
      isRegistering = true;

      try {
        // 尝试创建用户账户
        const auth = await firebaseConfig.getAuth();
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // 更新用户资料
        if (displayName) {
          await updateProfile(result.user, { displayName });
        }

        // 发送邮箱验证
        await sendEmailVerification(result.user);

        // 立即登出，避免界面闪烁
        await signOut(auth);

        return { verificationSent: true };
      } catch (createError: unknown) {
        // 如果账户已存在，尝试登录并重新发送验证邮件
        if ((createError as { code?: string }).code === "auth/email-already-in-use") {
          try {
            // 尝试登录现有账户
            const auth = await firebaseConfig.getAuth();
            const signInResult = await signInWithEmailAndPassword(auth, email, password);

            // 检查邮箱是否已验证
            if (!signInResult.user.emailVerified) {
              // 更新用户资料（如果需要）
              if (displayName) {
                await updateProfile(signInResult.user, { displayName });
              }

              // 重新发送验证邮件
              await sendEmailVerification(signInResult.user);

              // 立即登出
              await signOut(auth);

              return { verificationSent: true };
            } else {
              // 邮箱已验证，抛出错误
              throw new Error("EMAIL_ALREADY_VERIFIED");
            }
          } catch (signInError: unknown) {
            // 如果登录失败，可能是密码错误
            if (
              (signInError as { code?: string }).code === "auth/wrong-password" ||
              (signInError as { code?: string }).code === "auth/invalid-credential"
            ) {
              throw new Error("ACCOUNT_EXISTS_WRONG_PASSWORD");
            }
            throw signInError;
          }
        }
        throw createError;
      }
    } catch (error) {
      // 重置注册标志
      isRegistering = false;
      console.error("Send Sign-Up Link Error:", error);
      throw error;
    } finally {
      // 确保重置注册标志
      isRegistering = false;
    }
  },

  signUpWithEmail: async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ user: User; verificationSent: boolean }> => {
    try {
      const auth = await firebaseConfig.getAuth();
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      await sendEmailVerification(result.user);

      await signOut(auth);

      return { user: result.user, verificationSent: true };
    } catch (error) {
      console.error("Email Sign-Up Error:", error);
      throw error;
    }
  },

  sendEmailVerification: async (user: User): Promise<void> => {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error("Email Verification Error:", error);
      throw error;
    }
  },

  signInWithEmail: async (email: string, password: string): Promise<User | null> => {
    try {
      console.log("🔐 Starting email sign-in process...");
      isSigningIn = true;
      console.log("🔐 isSigningIn set to true");

      useAuthStore.getState().setAuthStep(AuthStep.AUTHENTICATING, AuthMessage.VERIFYING_CREDENTIALS, AuthProgress.AUTHENTICATING);

      const auth = await firebaseConfig.getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase authentication successful");
      console.log("📧 Email verified:", result.user.emailVerified);

      useAuthStore.getState().setAuthStep(AuthStep.VERIFYING_EMAIL, AuthMessage.CHECKING_EMAIL_VERIFICATION, AuthProgress.VERIFYING_EMAIL);

      if (!result.user.emailVerified) {
        console.log("📧 Email not verified, sending verification email...");
        await sendEmailVerification(result.user);
        console.log("📧 Verification email sent");
        await signOut(auth);
        console.log("🚪 User signed out due to unverified email");
        isSigningIn = false;
        console.log("🔐 isSigningIn reset to false due to unverified email");
        throw new Error("EMAIL_NOT_VERIFIED_RESENT");
      }

      console.log("✅ Email is verified, proceeding with login");
      useAuthStore.getState().setAuthStep(
        AuthStep.INITIALIZING_DATA,
        AuthMessage.SETTING_UP_WORKSPACE,
        AuthProgress.INITIALIZING_DATA
      );
      
      firebaseConfig.setUserIdForAnalytics(result.user.uid);
      // Do not init listeners here. Let onAuthStateChanged handle it once.

      console.log("🎉 Login process completed successfully");
      return result.user;
    } catch (error) {
      console.error("❌ Email Sign-In Error:", error);
      isSigningIn = false;
      console.log("🔐 isSigningIn reset to false due to error");
      
      useAuthStore.getState().setAuthStep(AuthStep.ERROR, AuthMessage.SIGN_IN_FAILED, AuthProgress.START);
      
      throw error;
    }
  },

  sendPasswordReset: async (email: string): Promise<void> => {
    try {
      const auth = await firebaseConfig.getAuth();
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    const auth = await firebaseConfig.getAuth();
    await signOut(auth);
    useNotesDataStore.getState().cleanupListeners();
    hasInitializedListeners = false;
  },

  onAuthStateChanged: async (callback: (user: User | null) => void): Promise<() => void> => {
    const auth = await firebaseConfig.getAuth();
    return onAuthStateChanged(auth, async user => {
      console.log(
        "🔄 Auth state changed:",
        user ? `User: ${user.email} (verified: ${user.emailVerified})` : "No user"
      );
      console.log("🔐 isRegistering:", isRegistering, "isSigningIn:", isSigningIn);

      // 如果是注册过程，跳过处理
      if (isRegistering) {
        console.log("⏸️ Skipping auth state change due to ongoing registration");
        return;
      }

      // 登录流程：已验证用户
      if (isSigningIn && user && user.emailVerified) {
        console.log("✅ Processing login state change - user is verified (init once)");
        firebaseConfig.setUserIdForAnalytics(user.uid);
        if (!hasInitializedListeners) {
          hasInitializedListeners = true;
          useAuthStore.getState().setAuthStep(
            AuthStep.INITIALIZING_DATA,
            AuthMessage.SETTING_UP_WORKSPACE,
            AuthProgress.INITIALIZING_DATA
          );
          await useNotesDataStore.getState().initFirebaseListeners(user.uid);
        }
        useAuthStore.getState().setAuthStep(
          AuthStep.COMPLETE,
          AuthMessage.WELCOME_BACK,
          AuthProgress.COMPLETE
        );
        isSigningIn = false;
        // Ensure auth store receives the new user immediately
        callback(user);
        return;
      } else if (isSigningIn) {
        console.log("⏸️ Skipping auth state change due to ongoing sign-in (unverified user)");
        return;
      }

      if (user) {
        firebaseConfig.setUserIdForAnalytics(user.uid);

        if (user.emailVerified) {
          console.log("✅ User email verified, initializing listeners");
          if (!hasInitializedListeners) {
            hasInitializedListeners = true;
            await useNotesDataStore.getState().initFirebaseListeners(user.uid);
          } else {
            console.log("ℹ️ Listeners already initialized, skipping duplicate init");
          }
        } else {
          console.log("❌ User email not verified, cleaning up listeners");
          useNotesDataStore.getState().cleanupListeners();
        }
      } else {
        console.log("🚪 No user, cleaning up listeners");
        useNotesDataStore.getState().cleanupListeners();
        hasInitializedListeners = false;
      }

      console.log("📞 Calling auth state callback");
      callback(user);
    });
  },

  getCurrentUser: async (): Promise<User | null> => {
    const auth = await firebaseConfig.getAuth();
    return auth.currentUser;
  },

  checkEmailVerification: async (): Promise<boolean> => {
    const auth = await firebaseConfig.getAuth();
    const user = auth.currentUser;
    if (!user) return false;

    await user.reload();
    return user.emailVerified;
  },
};
