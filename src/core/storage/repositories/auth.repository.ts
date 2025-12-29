import type { AppUser } from "@/core/types/auth";
import type { Unsubscribe } from "@/core/storage/types";

/**
 * Auth Repository Interface
 * Abstracts authentication operations across different backends
 */
export interface AuthRepository {
  // Sign in methods
  signInWithGoogle(): Promise<AppUser | null>;
  signInWithEmail(email: string, password: string): Promise<AppUser | null>;
  
  // Sign up
  signUpWithEmail(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ user: AppUser; verificationSent: boolean }>;
  
  sendSignUpLink(
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ verificationSent: boolean }>;
  
  // Password reset
  sendPasswordReset(email: string): Promise<void>;
  
  // Email verification
  sendEmailVerification(): Promise<void>;
  
  // Sign out
  signOut(): Promise<void>;
  
  // Current user
  getCurrentUser(): Promise<AppUser | null>;
  
  // Auth state changes
  onAuthStateChanged(callback: (user: AppUser | null) => void): Unsubscribe;
}
