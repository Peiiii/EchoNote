import { firebaseConfig } from "@/common/config/firebase.config";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
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
      const auth = await firebaseConfig.getAuth();
      const result = await signInWithPopup(auth, provider);
      await useNotesDataStore.getState().initFirebaseListeners(result.user.uid);
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

      const auth = await firebaseConfig.getAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase authentication successful");
      console.log("📧 Email verified:", result.user.emailVerified);

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
      console.log("🔗 Initializing Firebase listeners...");
      await useNotesDataStore.getState().initFirebaseListeners(result.user.uid);
      console.log("✅ Firebase listeners initialized");

      // 在初始化监听器后再重置标志，确保 onAuthStateChanged 能正确处理
      isSigningIn = false;
      console.log("🔐 isSigningIn set to false after listeners initialized");

      console.log("🎉 Login process completed successfully");
      return result.user;
    } catch (error) {
      console.error("❌ Email Sign-In Error:", error);
      isSigningIn = false;
      console.log("🔐 isSigningIn reset to false due to error");
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

      // 如果是登录过程，但用户已通过邮箱验证，则处理这个状态变化
      if (isSigningIn && user && user.emailVerified) {
        console.log("✅ Processing login state change - user is verified");
        // 不在这里初始化监听器，因为 signInWithEmail 已经处理了
      } else if (isSigningIn) {
        console.log("⏸️ Skipping auth state change due to ongoing sign-in (unverified user)");
        return;
      }

      if (user) {
        if (user.emailVerified) {
          console.log("✅ User email verified, initializing listeners");
          await useNotesDataStore.getState().initFirebaseListeners(user.uid);
        } else {
          console.log("❌ User email not verified, cleaning up listeners");
          useNotesDataStore.getState().cleanupListeners();
        }
      } else {
        console.log("🚪 No user, cleaning up listeners");
        useNotesDataStore.getState().cleanupListeners();
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
