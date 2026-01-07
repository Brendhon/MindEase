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

