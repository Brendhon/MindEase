/**
 * User Preferences Model - MindEase
 * User cognitive accessibility preferences
 */
export interface UserPreferences {
  contrast: "normal" | "high" | "low";
  spacing: "normal" | "compact" | "relaxed";
  fontSize: "normal" | "small" | "large";
  animations: boolean;
  focusMode: boolean;
  textDetail: "detailed" | "summary";
}

/**
 * User Preferences with Firestore metadata
 */
export interface UserPreferencesDocument extends UserPreferences {
  id: string;
  userId: string;
  updatedAt: Date;
}

/**
 * Default accessibility settings
 */
export const DEFAULT_ACCESSIBILITY_SETTINGS: UserPreferences = {
  contrast: "normal",
  spacing: "normal",
  fontSize: "normal",
  animations: true,
  focusMode: false,
  textDetail: "detailed",
};

