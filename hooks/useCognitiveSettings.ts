import { useCognitiveSettingsContext } from "@/contexts/cognitive-settings-context";
import { getAccessibilityText, type AccessibilityTextKey } from "@/utils/accessibility/content";
import {
  getAnimationClasses,
  getCombinedAccessibilityClasses,
  getContrastClasses,
  getFocusModeClasses,
  getFontSizeClasses,
  getSpacingClasses,
  getSpacingValue,
} from "@/utils/accessibility/tailwind-classes";
import { useMemo } from "react";

/**
 * useCognitiveSettings Hook - MindEase
 * 
 * Unified hook for cognitive accessibility settings management.
 * 
 * Provides:
 * - Current user preferences state
 * - Methods to update settings (auto-saved to Firestore)
 * - Tailwind class generators for all accessibility settings
 * - Text detail helpers for detailed/summary content
 * - Loading and error states
 * 
 * @example
 * ```tsx
 * // Basic usage
 * function MyComponent() {
 *   const { settings, updateSetting } = useCognitiveSettings();
 *   return (
 *     <button onClick={() => updateSetting("contrast", "high")}>
 *       High Contrast
 *     </button>
 *   );
 * }
 * 
 * // Using Tailwind classes
 * function StyledComponent() {
 *   const { getContrastClasses, getFontSizeClasses } = useCognitiveSettings();
 *   return (
 *     <div className={`${getContrastClasses()} ${getFontSizeClasses().base}`}>
 *       Accessible content
 *     </div>
 *   );
 * }
 * 
 * // Using text detail
 * function TextComponent() {
 *   const { textDetail } = useCognitiveSettings();
 *   return <p>{textDetail.getText("welcome")}</p>;
 * }
 * ```
 * 
 * @throws Error if used outside CognitiveSettingsProvider
 */
export function useCognitiveSettings() {
  const { 
    settings, 
    updateSetting, 
    updateSettings, 
    resetSettings,
    isLoading,
    error,
  } = useCognitiveSettingsContext();

  // Text detail helpers
  const textDetail = useMemo(() => ({
    mode: settings.textDetail,
    isDetailed: settings.textDetail === "detailed",
    isSummary: settings.textDetail === "summary",
    getText: (key: AccessibilityTextKey) => getAccessibilityText(key, settings.textDetail),
    render: <T,>(detailed: T, summary: T): T => {
      return settings.textDetail === "summary" ? summary : detailed;
    },
  }), [settings.textDetail]);

  // Memoized class generators bound to current settings
  const contrastClasses = useMemo(() => getContrastClasses(settings.contrast), [settings.contrast]);
  const spacingClasses = useMemo(() => getSpacingClasses(settings.spacing), [settings.spacing]);
  const spacingValue = useMemo(() => getSpacingValue(settings.spacing), [settings.spacing]);
  const fontSizeClasses = useMemo(() => getFontSizeClasses(settings.fontSize), [settings.fontSize]);
  const animationClasses = useMemo(() => getAnimationClasses(settings.animations), [settings.animations]);
  const focusModeClasses = useMemo(() => getFocusModeClasses(settings.focusMode), [settings.focusMode]);

  return {
    // State
    settings,
    isLoading,
    error,
    
    // Mutations
    updateSetting,
    updateSettings,
    resetSettings,
    
    // Text detail helpers
    textDetail,
    
    // Tailwind classes (pre-computed for current settings)
    contrastClasses,
    spacingClasses,
    spacingValue,
    fontSizeClasses,
    animationClasses,
    focusModeClasses,
    
    // Dynamic class generators (for custom settings)
    getContrastClasses: (contrast = settings.contrast) => getContrastClasses(contrast),
    getSpacingClasses: (spacing = settings.spacing) => getSpacingClasses(spacing),
    getSpacingValue: (spacing = settings.spacing) => getSpacingValue(spacing),
    getFontSizeClasses: (fontSize = settings.fontSize) => getFontSizeClasses(fontSize),
    getAnimationClasses: (animations = settings.animations) => getAnimationClasses(animations),
    getFocusModeClasses: (focusMode = settings.focusMode) => getFocusModeClasses(focusMode),
    getCombinedClasses: (context: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" = "base") => 
      getCombinedAccessibilityClasses(settings, context),
  };
}
