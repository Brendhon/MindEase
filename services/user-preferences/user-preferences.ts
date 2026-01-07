/**
 * User Preferences Service - MindEase
 * User cognitive accessibility preferences management service
 */
import { db } from "@/config/firebase";
import { DEFAULT_ACCESSIBILITY_SETTINGS, UserPreferences, UserPreferencesDocument } from "@/models/UserPreferences";
import { getUserPreferencesDocumentPath } from "@/utils/firestore/paths";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * User Preferences Service interface
 */
export interface UserPreferencesService {
  getUserPreferences: (userId: string) => Promise<UserPreferences>;
  updateUserPreferences: (userId: string, preferences: Partial<UserPreferences>) => Promise<UserPreferences>;
  resetUserPreferences: (userId: string) => Promise<UserPreferences>;
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
      const docPath = getUserPreferencesDocumentPath(userId);
      const [collectionPath, docId] = docPath.split("/");
      
      // Try to get existing preferences
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserPreferencesDocument;
        // Return only the preferences, not metadata
        return {
          contrast: data.contrast,
          spacing: data.spacing,
          fontSize: data.fontSize,
          animations: data.animations,
          focusMode: data.focusMode,
          textDetail: data.textDetail,
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
      const docPath = getUserPreferencesDocumentPath(userId);
      const [collectionPath, docId] = docPath.split("/");
      
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

      // Use setDoc with merge to create or update
      const docRef = doc(db, collectionPath, docId);
      await setDoc(docRef, docData, { merge: true });

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
};

