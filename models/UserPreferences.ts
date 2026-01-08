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
  // Timer settings (Pomodoro adapted)
  focusDuration: number; // Focus time in minutes (default: 25)
  shortBreakDuration: number; // Short break in minutes (default: 5)
  longBreakDuration?: number; // Long break in minutes (optional, default: 15)
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
  // Timer defaults
  focusDuration: 25, // 25 minutes
  shortBreakDuration: 5, // 5 minutes
  longBreakDuration: 15, // 15 minutes (optional)
};

