import type { AppUser } from "@/core/types/auth";
import type { AuthRepository } from "@/core/storage/repositories/auth.repository";
import type { Unsubscribe } from "@/core/storage/types";

export class LocalAuthAdapter implements AuthRepository {
  async signInWithGoogle(): Promise<AppUser | null> {
    return null;
  }
  async signInWithEmail(_email: string, _password: string): Promise<AppUser | null> {
    return null;
  }
  async signUpWithEmail(
    _email: string,
    _password: string,
    _displayName?: string
  ): Promise<{ user: AppUser; verificationSent: boolean }> {
    throw new Error("Local backend does not support sign-up");
  }
  async sendSignUpLink(
    _email: string,
    _password: string,
    _displayName?: string
  ): Promise<{ verificationSent: boolean }> {
    throw new Error("Local backend does not support sign-up");
  }
  async sendPasswordReset(_email: string): Promise<void> {
    throw new Error("Local backend does not support password reset");
  }
  async sendEmailVerification(): Promise<void> {
    throw new Error("Local backend does not support email verification");
  }
  async signOut(): Promise<void> {
    return;
  }
  async getCurrentUser(): Promise<AppUser | null> {
    return null;
  }
  onAuthStateChanged(callback: (user: AppUser | null) => void): Unsubscribe {
    callback(null);
    return () => {};
  }
}

