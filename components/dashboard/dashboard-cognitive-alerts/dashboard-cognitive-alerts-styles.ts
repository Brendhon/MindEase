import { UserPreferences } from "@/models/user-preferences";
import { getContrastClasses } from "@/utils/accessibility";

/**
 * Dashboard Cognitive Alerts Styles - MindEase
 * Centralized styles and utility functions for cognitive alerts components
 */

export const styles = {
  // Banner base styles
  banner: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-lg bg-surface-primary border-2 border-action-warning/50 shadow-soft",
  bannerContent: "flex flex-col flex-1 min-w-0",
  bannerTitle: "font-semibold",
  bannerMessage: "text-text-secondary mt-1",
  bannerActions: "flex items-center gap-2 flex-shrink-0",
  
  icon: {
    base: "flex items-center justify-center",
    color: "text-action-warning",
    animate: "animate-bell-ring",
  } as const,

  // Dismiss button styles
  dismissButton: "flex items-center justify-center w-8 h-8 rounded-md hover:bg-action-info/20 transition-colors focus:outline-none focus:ring-2 focus:ring-action-info focus:ring-offset-2",
  dismissIcon: "w-4 h-4 text-action-info",
  
  // Contrast-specific styles
  contrast: {
    // Normal contrast: standard transitions
    normal: "transition-colors duration-150",
    
    // High contrast: enhanced borders and outlines for better visibility
    high: {
      base: "border-2 transition-colors duration-150 outline outline-2 outline-offset-2",
      banner: "border-2 border-action-info outline-action-info/30",
    } as const,
  } as const,
} as const;

/**
 * Get contrast-aware classes for cognitive alerts components
 * 
 * @param contrast - Contrast mode from user preferences
 * @param component - Component type to get specific contrast classes
 * @returns Combined contrast classes string
 * 
 * @example
 * ```tsx
 * const classes = getContrastClassesForAlerts("high", "banner");
 * // Returns: "transition-colors duration-150 contrast-more border-2 border-action-info outline-action-info/30 outline outline-2 outline-offset-2"
 * ```
 */
export function getContrastClassesForAlerts(
  contrast: UserPreferences["contrast"],
  component?: "banner"
): string {
  const baseContrast = getContrastClasses(contrast);
  
  if (contrast === "high") {
    const componentClass = component 
      ? styles.contrast.high[component] 
      : "";
    const highContrastBase = styles.contrast.high.base;
    return [baseContrast, highContrastBase, componentClass].filter(Boolean).join(" ");
  }
  
  return baseContrast;
}
