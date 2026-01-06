/**
 * Auth Service - MindEase
 * Authentication service for Firebase Auth
 */
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/config/firebase";

/**
 * Google Auth Provider instance
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Auth Service interface
 */
export interface AuthService {
  signInWithGoogle: () => Promise<{ uid: string; email: string | null }>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<{ uid: string; email: string | null } | null>;
  onAuthStateChange: (callback: (user: { uid: string; email: string | null } | null) => void) => () => void;
}

/**
 * Convert Firebase User to our user format
 */
const convertUser = (user: User | null): { uid: string; email: string | null } | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
  };
};

/**
 * Auth Service implementation
 */
export const authService: AuthService = {
  /**
   * Sign in with Google using popup
   */
  signInWithGoogle: async (): Promise<{ uid: string; email: string | null }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = convertUser(result.user);
      if (!user) {
        throw new Error("Failed to get user information after sign in");
      }
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<{ uid: string; email: string | null } | null> => {
    try {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          resolve(convertUser(user));
        });
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Listen to authentication state changes
   * @returns Unsubscribe function
   */
  onAuthStateChange: (
    callback: (user: { uid: string; email: string | null } | null) => void
  ): (() => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(convertUser(user));
    });
  },
};

