import type { AppUser } from "@/core/types/auth";
import { toAppUser } from "@/core/types/auth";
import type { Unsubscribe } from "@/core/storage/types";
import type { AuthRepository } from "@/core/storage/repositories/auth.repository";
import { firebaseAuthService } from "@/common/services/firebase/firebase-auth.service";

/**
 * Firebase Auth Adapter
 * Implements AuthRepository using Firebase Authentication
 */
export class FirebaseAuthAdapter implements AuthRepository {
  async signInWithGoogle(): Promise<AppUser | null> {
    const user = await firebaseAuthService.signInWithGoogle();
    return user ? toAppUser(user) : null;
  }

  async signInWithEmail(email: string, password: string): Promise<AppUser | null> {
    const user = await firebaseAuthService.signInWithEmail(email, password);
    return user ? toAppUser(user) : null;
  }

  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ user: AppUser; verificationSent: boolean }> {
    const result = await firebaseAuthService.signUpWithEmail(email, password, displayName);
    return {
      user: toAppUser(result.user),
      verificationSent: result.verificationSent,
    };
  }

  async sendSignUpLink(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ verificationSent: boolean }> {
    return firebaseAuthService.sendSignUpLink(email, password, displayName);
  }

  async sendPasswordReset(email: string): Promise<void> {
    return firebaseAuthService.sendPasswordReset(email);
  }

  async sendEmailVerification(): Promise<void> {
    // Note: Firebase requires the current user object
    // The service handles getting the current user internally
    const user = await firebaseAuthService.getCurrentUser();
    if (!user) {
      throw new Error("No user logged in");
    }
    return firebaseAuthService.sendEmailVerification(user);
  }

  async signOut(): Promise<void> {
    return firebaseAuthService.signOut();
  }

  async getCurrentUser(): Promise<AppUser | null> {
    const user = await firebaseAuthService.getCurrentUser();
    return user ? toAppUser(user) : null;
  }

  onAuthStateChanged(callback: (user: AppUser | null) => void): Unsubscribe {
    // We return a function that will be called to unsubscribe
    // Since the original is async, we need to handle this carefully
    let unsubscribe: (() => void) | null = null;
    
    firebaseAuthService.onAuthStateChanged(user => {
      callback(user ? toAppUser(user) : null);
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }
}

export const firebaseAuthAdapter = new FirebaseAuthAdapter();
