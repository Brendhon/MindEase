/**
 * User Preferences Service - MindEase
 * User cognitive accessibility preferences management service
 */
import {
  DEFAULT_ACCESSIBILITY_SETTINGS,
  UserPreferences,
  UserPreferencesDocument,
} from '@/models/user-preferences';
import { Unsubscribe } from 'firebase/firestore';
import { firestoreService } from '../firestore/firestore';

/**
 * User Preferences Service interface
 */
export interface UserPreferencesService {
  getUserPreferences: (userId: string) => Promise<UserPreferences>;
  subscribeUserPreferences: (
    userId: string,
    onNext: (preferences: UserPreferences) => void,
    onError?: (err: Error) => void
  ) => Unsubscribe;
  updateUserPreferences: (
    userId: string,
    preferences: Partial<UserPreferences>
  ) => Promise<UserPreferences>;
  resetUserPreferences: (userId: string) => Promise<UserPreferences>;
  deleteUserPreferences: (userId: string) => Promise<void>;
}

/**
 * Extract preferences from document (removes metadata)
 */
const extractPreferences = (
  document: UserPreferencesDocument
): UserPreferences => ({
  contrast: document.contrast,
  spacing: document.spacing,
  fontSize: document.fontSize,
  animations: document.animations,
  focusMode: document.focusMode,
  textDetail: document.textDetail,
  focusDuration: document.focusDuration,
  shortBreakDuration: document.shortBreakDuration,
  longBreakDuration: document.longBreakDuration,
});

/**
 * User Preferences Service implementation
 */
export const userPreferencesService: UserPreferencesService = {
  /**
   * Get user preferences from Firestore
   * Returns default settings if no preferences exist
   */
  getUserPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      const document =
        await firestoreService.getDocument<UserPreferencesDocument>(
          'users',
          userId
        );

      if (document) {
        // Return only the preferences, not metadata
        return extractPreferences(document);
      }

      // If no preferences exist, return defaults
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    } catch (error) {
      console.error(
        `Error getting user preferences for user ${userId}:`,
        error
      );
      // Return defaults on error
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }
  },

  /**
   * Subscribe to user preferences document for real-time updates.
   * Returns an unsubscribe function to stop listening.
   * Calls onNext with defaults when the document does not exist.
   */
  subscribeUserPreferences: (
    userId: string,
    onNext: (preferences: UserPreferences) => void,
    onError?: (err: Error) => void
  ): Unsubscribe => {
    return firestoreService.subscribeDocument<UserPreferencesDocument>(
      'users',
      userId,
      (doc) => {
        if (doc) {
          onNext(extractPreferences(doc));
        } else {
          onNext(DEFAULT_ACCESSIBILITY_SETTINGS);
        }
      },
      onError
    );
  },

  /**
   * Update user preferences in Firestore
   * Creates document if it doesn't exist
   */
  updateUserPreferences: async (
    userId: string,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> => {
    try {
      // Get current preferences or defaults
      const current = await userPreferencesService.getUserPreferences(userId);

      // Merge with updates
      const updated: UserPreferences = {
        ...current,
        ...preferences,
      };

      // Prepare document with metadata
      const docData: Omit<UserPreferencesDocument, 'id'> = {
        ...updated,
        userId,
        updatedAt: new Date(),
      };

      // Use setDocument with merge to create or update
      await firestoreService.setDocument<UserPreferencesDocument>(
        'users',
        userId,
        docData
      );

      return updated;
    } catch (error) {
      console.error(
        `Error updating user preferences for user ${userId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Reset user preferences to defaults
   */
  resetUserPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      return await userPreferencesService.updateUserPreferences(
        userId,
        DEFAULT_ACCESSIBILITY_SETTINGS
      );
    } catch (error) {
      console.error(
        `Error resetting user preferences for user ${userId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Delete user preferences document
   */
  deleteUserPreferences: async (userId: string): Promise<void> => {
    try {
      await firestoreService.deleteDocument('users', userId);
    } catch (error) {
      console.error(
        `Error deleting user preferences for user ${userId}:`,
        error
      );
      throw error;
    }
  },
};
