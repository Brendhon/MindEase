/**
 * Active Task Indicator Styles - MindEase
 * Centralized styles for active task indicator component
 */

import { UserPreferences } from "@/models/UserPreferences";
import type { TimerType } from "./use-active-task-indicator";

export const styles = {
  container: "fixed bottom-4 right-4 z-50 w-56 bg-surface-primary cursor-pointer hover:bg-surface-secondary transition-colors duration-fast",
  card: "rounded-lg shadow-lg border hover:shadow-xl transition-shadow duration-fast",
  contrast: {
    // Normal contrast: subtle shadow
    normal: "shadow-medium",

    // High contrast: thicker border, outline, and stronger shadow for better visibility
    high: {
      base: "shadow-lg border-4 outline outline-2 outline-offset-2 outline-black",
      focus: "border-action-primary",
      break: "border-action-warning",
    } as const,
  } as const,
  type: {
    focus: {
      bgColor: "bg-action-white",
      borderColor: "border-action-primary/60 border-2",
      iconColor: "text-action-primary",
    },
    break: {
      bgColor: "bg-action-white",
      borderColor: "border-action-warning/30 border-2",
      iconColor: "text-action-warning",
    },
  } as const,
  content: "flex items-start gap-3",
  iconContainer: "flex-shrink-0",
  textContainer: "flex-1 min-w-0",
  title: "font-semibold text-text-primary/80 truncate",
  status: "text-text-secondary text-sm italic mb-4",
  timerContainer: "mt-2 pt-2 border-t border-border-subtle flex items-center justify-end",
  timer: "font-semibold font-bold text-text-secondary",
  transition: {
    // Reduced motion: minimal transition for accessibility
    reduced: "transition-opacity duration-fast",
    // Normal: full transition with easing
    normal: "transition-all duration-normal ease-base",
  } as const,
} as const;

/**
 * Get contrast-aware classes for indicator card
 * 
 * @param contrast - Contrast mode (normal, high)
 * @param timerType - Timer type (focus, break)
 * @returns CSS classes string
 */
export function getContrastClasses(
  contrast: UserPreferences["contrast"],
  timerType: TimerType
): string {
  if (contrast === "high") {
    const borderColorClass = styles.contrast.high[timerType];
    return `${styles.contrast.high.base} ${borderColorClass}`;
  }

  return styles.contrast.normal;
}

/**
 * Get type-specific classes (background, border, icon color)
 * 
 * @param timerType - Timer type (focus, break)
 * @returns Object with bgColor, borderColor, and iconColor classes
 */
export function getTypeClasses(timerType: TimerType) {
  return styles.type[timerType];
}

/**
 * Get transition classes based on animation preference
 * 
 * @param animations - Whether animations are enabled
 * @returns CSS classes string
 */
export function getTransitionClasses(animations: boolean): string {
  return animations ? styles.transition.normal : styles.transition.reduced;
}
