/**
 * User Preferences Service - MindEase
 * User cognitive accessibility preferences management service
 */
import { DEFAULT_ACCESSIBILITY_SETTINGS, UserPreferences, UserPreferencesDocument } from "@/models/UserPreferences";
import { firestoreService } from "../firestore/firestore";

/**
 * User Preferences Service interface
 */
export interface UserPreferencesService {
  getUserPreferences: (userId: string) => Promise<UserPreferences>;
  updateUserPreferences: (userId: string, preferences: Partial<UserPreferences>) => Promise<UserPreferences>;
  resetUserPreferences: (userId: string) => Promise<UserPreferences>;
  deleteUserPreferences: (userId: string) => Promise<void>;
}

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
      const document = await firestoreService.getDocument<UserPreferencesDocument>("users", userId);

      if (document) {
        // Return only the preferences, not metadata
        return {
          contrast: document.contrast,
          spacing: document.spacing,
          fontSize: document.fontSize,
          animations: document.animations,
          focusMode: document.focusMode,
          textDetail: document.textDetail,
          focusDuration: document.focusDuration,
          shortBreakDuration: document.shortBreakDuration,
        };
      }

      // If no preferences exist, return defaults
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    } catch (error) {
      console.error(`Error getting user preferences for user ${userId}:`, error);
      // Return defaults on error
      return DEFAULT_ACCESSIBILITY_SETTINGS;
    }
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
      const docData: Omit<UserPreferencesDocument, "id"> = {
        ...updated,
        userId,
        updatedAt: new Date(),
      };

      // Use setDocument with merge to create or update
      await firestoreService.setDocument<UserPreferencesDocument>("users", userId, docData);

      return updated;
    } catch (error) {
      console.error(`Error updating user preferences for user ${userId}:`, error);
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
      console.error(`Error resetting user preferences for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Delete user preferences document
   */
  deleteUserPreferences: async (userId: string): Promise<void> => {
    try {
      await firestoreService.deleteDocument("users", userId);
    } catch (error) {
      console.error(`Error deleting user preferences for user ${userId}:`, error);
      throw error;
    }
  },
};

