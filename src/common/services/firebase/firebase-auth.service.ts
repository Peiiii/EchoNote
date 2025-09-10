import { auth } from '@/common/config/firebase.config';
import { useChatDataStore } from '@/core/stores/chat-data.store';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';

let isRegistering = false;

export const firebaseAuthService = {

  signInWithGoogle: async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await useChatDataStore.getState().initFirebaseListeners(result.user.uid);
      return result.user; 
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      return null;
    }
  },

  sendSignUpLink: async (email: string, password: string, displayName?: string): Promise<{ verificationSent: boolean }> => {
    try {
      // 设置注册标志，避免界面闪烁
      isRegistering = true;
      
      try {
        // 尝试创建用户账户
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
        if ((createError as { code?: string }).code === 'auth/email-already-in-use') {
          try {
            // 尝试登录现有账户
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
              throw new Error('EMAIL_ALREADY_VERIFIED');
            }
          } catch (signInError: unknown) {
            // 如果登录失败，可能是密码错误
            if ((signInError as { code?: string }).code === 'auth/wrong-password' || (signInError as { code?: string }).code === 'auth/invalid-credential') {
              throw new Error('ACCOUNT_EXISTS_WRONG_PASSWORD');
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

  signUpWithEmail: async (email: string, password: string, displayName?: string): Promise<{ user: User; verificationSent: boolean }> => {
    try {
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
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (!result.user.emailVerified) {
        await signOut(auth);
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      
      await useChatDataStore.getState().initFirebaseListeners(result.user.uid);
      return result.user;
    } catch (error) {
      console.error("Email Sign-In Error:", error);
      throw error;
    }
  },

  sendPasswordReset: async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    await signOut(auth);
    useChatDataStore.getState().cleanupListeners();
  },

  onAuthStateChanged: (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (isRegistering) {
        return;
      }
      
      if (user) {
        if (user.emailVerified) {
          await useChatDataStore.getState().initFirebaseListeners(user.uid);
        } else {
          useChatDataStore.getState().cleanupListeners();
        }
      } else {
        useChatDataStore.getState().cleanupListeners();
      }
      callback(user);
    });
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  checkEmailVerification: async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;
    
    await user.reload();
    return user.emailVerified;
  },

};
