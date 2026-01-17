import { UserPreferences } from "@/models/user-preferences";
import type { FeedbackType } from "@/hooks/feedback";

/**
 * Toast Styles - MindEase
 * Centralized styles and utility functions for toast components
 */

export const styles = {
  toastContainer: "fixed top-4 right-4 z-50 flex flex-col pointer-events-none",
  toastItem: "pointer-events-auto",
  toastCard: "relative flex items-center w-full max-w-md rounded-lg",
  contrast: {
    // Normal contrast: subtle shadow
    normal: "shadow-medium",
    
    // High contrast: thicker border, outline, and stronger shadow for better visibility
    high: {
      base: "shadow-lg border-4 outline outline-2 outline-offset-2 outline-black/20",
      error: "border-feedback-error",
      warning: "border-feedback-warning",
      success: "border-feedback-success",
      info: "border-feedback-info",
    } as const,
  } as const,
  type: {
    success: {
      bgColor: "bg-feedback-success",
      textColor: "text-white",
    },
    error: {
      bgColor: "bg-feedback-error",
      textColor: "text-white",
    },
    warning: {
      bgColor: "bg-feedback-warning",
      textColor: "text-white",
    },
    info: {
      bgColor: "bg-feedback-info",
      textColor: "text-white",
    },
  } as const,
  transition: {
    // Reduced motion: minimal transition for accessibility
    reduced: "transition-opacity duration-fast",
    // Normal: full transition with easing
    normal: "transition-all duration-normal ease-base",
  } as const,
} as const;

/**
 * Get contrast-aware classes for toast
 * 
 * Note: This is toast-specific logic that extends the base contrast classes
 * from utils/accessibility/tailwind-classes.ts with type-specific borders.
 * 
 * For general contrast classes, use useCognitiveSettings().contrastClasses
 */
export function getContrastClasses(
  contrast: UserPreferences["contrast"],
  type: FeedbackType
): string {
  if (contrast === "high") {
    const borderColorClass = styles.contrast.high[type];
    return `${styles.contrast.high.base} ${borderColorClass}`;
  }

  return styles.contrast.normal;
}

/**
 * Get background and text color classes based on toast type
 * 
 * Note: High contrast colors are automatically applied via CSS variables
 * when contrast mode is enabled (defined in globals.css)
 */
export function getTypeClasses(
  type: FeedbackType
): { bgColor: string; textColor: string } {
  return styles.type[type];
}

/**
 * Get transition classes based on animation preference
 * 
 * Note: This is toast-specific logic for Transition component from Headless UI.
 * For general animation classes, use useCognitiveSettings().animationClasses
 */
export function getTransitionClasses(animations: boolean): string {
  return animations ? styles.transition.normal : styles.transition.reduced;
}

