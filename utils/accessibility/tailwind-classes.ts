/**
 * Tailwind Classes Utilities - MindEase
 * Dynamic Tailwind class generation for accessibility settings
 */
import { UserPreferences } from "@/models/UserPreferences";

/**
 * Get Tailwind classes for contrast settings
 * 
 * @param contrast - Contrast mode (normal, high, low)
 * @returns Tailwind classes string
 * 
 * @example
 * ```tsx
 * const classes = getContrastClasses("high");
 * // Returns: "contrast-more text-gray-900 border-gray-900"
 * ```
 */
export function getContrastClasses(contrast: UserPreferences["contrast"]): string {
  const baseClasses = "transition-colors duration-200";
  
  switch (contrast) {
    case "high":
      return `${baseClasses} contrast-more text-gray-900 dark:text-gray-50`;
    case "low":
      return `${baseClasses} contrast-less text-gray-600 dark:text-gray-400`;
    case "normal":
    default:
      return baseClasses;
  }
}

/**
 * Get Tailwind classes for spacing settings
 * Returns padding and gap classes that can be applied to containers
 * 
 * @param spacing - Spacing mode (normal, compact, relaxed)
 * @returns Object with different spacing class types
 * 
 * @example
 * ```tsx
 * const { padding, gap } = getSpacingClasses("relaxed");
 * // padding: "p-6", gap: "gap-6"
 * ```
 */
export function getSpacingClasses(spacing: UserPreferences["spacing"]): {
  padding: string;
  gap: string;
  margin: string;
} {
  switch (spacing) {
    case "compact":
      return {
        padding: "p-2",
        gap: "gap-2",
        margin: "m-2",
      };
    case "relaxed":
      return {
        padding: "p-6",
        gap: "gap-6",
        margin: "m-6",
      };
    case "normal":
    default:
      return {
        padding: "p-4",
        gap: "gap-4",
        margin: "m-4",
      };
  }
}

/**
 * Get individual spacing value for specific use cases
 * Returns a single spacing unit that can be used with any spacing utility
 * 
 * @param spacing - Spacing mode
 * @returns Spacing value (2, 4, or 6)
 */
export function getSpacingValue(spacing: UserPreferences["spacing"]): number {
  switch (spacing) {
    case "compact":
      return 2;
    case "relaxed":
      return 6;
    case "normal":
    default:
      return 4;
  }
}

/**
 * Get Tailwind classes for font size settings
 * 
 * @param fontSize - Font size mode (normal, small, large)
 * @returns Object with text size classes for different contexts
 * 
 * @example
 * ```tsx
 * const { base, heading, small } = getFontSizeClasses("large");
 * // base: "text-lg", heading: "text-3xl", small: "text-base"
 * ```
 */
export function getFontSizeClasses(fontSize: UserPreferences["fontSize"]): {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
} {
  switch (fontSize) {
    case "small":
      return {
        xs: "text-[10px]",
        sm: "text-xs",
        base: "text-sm",
        lg: "text-base",
        xl: "text-lg",
        "2xl": "text-xl",
        "3xl": "text-2xl",
      };
    case "large":
      return {
        xs: "text-sm",
        sm: "text-base",
        base: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
        "2xl": "text-3xl",
        "3xl": "text-4xl",
      };
    case "normal":
    default:
      return {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
      };
  }
}

/**
 * Get Tailwind classes for animation settings
 * Controls transition and animation durations
 * 
 * @param animations - Whether animations are enabled
 * @returns Animation-related classes
 * 
 * @example
 * ```tsx
 * const classes = getAnimationClasses(false);
 * // Returns: "motion-reduce:transition-none motion-reduce:animate-none"
 * ```
 */
export function getAnimationClasses(animations: boolean): string {
  if (!animations) {
    return "motion-reduce:transition-none motion-reduce:animate-none [&_*]:!duration-[0.01ms] [&_*]:!transition-none";
  }
  return "motion-safe:transition-all";
}

/**
 * Get Tailwind classes for focus mode
 * Applies visual emphasis when focus mode is enabled
 * 
 * @param focusMode - Whether focus mode is enabled
 * @returns Focus mode classes
 */
export function getFocusModeClasses(focusMode: boolean): string {
  if (focusMode) {
    return "ring-2 ring-blue-500 ring-offset-2 shadow-lg";
  }
  return "";
}

/**
 * Combine all accessibility classes for a component
 * Convenience function that applies all accessibility settings at once
 * 
 * @param settings - User preferences
 * @returns Combined classes string
 * 
 * @example
 * ```tsx
 * const classes = getCombinedAccessibilityClasses(settings);
 * <div className={classes}>...</div>
 * ```
 */
export function getCombinedAccessibilityClasses(
  settings: UserPreferences,
  context: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" = "base"
): string {
  const contrast = getContrastClasses(settings.contrast);
  const fontSize = getFontSizeClasses(settings.fontSize)[context];
  const animations = getAnimationClasses(settings.animations);
  const focusMode = getFocusModeClasses(settings.focusMode);
  
  return [contrast, fontSize, animations, focusMode].filter(Boolean).join(" ");
}

