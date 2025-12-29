/**
 * Application user type - abstracts away Firebase User
 * This allows the auth layer to work with different backends
 */
export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

/**
 * Convert Firebase User (or any backend user) to AppUser
 */
export function toAppUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}): AppUser {
  return {
    id: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL,
  };
}
