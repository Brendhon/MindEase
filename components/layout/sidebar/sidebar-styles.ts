import { UserPreferences } from "@/models/UserPreferences";

/**
 * Sidebar Styles - MindEase
 * Centralized styles and utility functions for sidebar components
 */

export const styles = {
  aside: "bg-surface-primary border-r border-border-subtle",
  nav: "flex flex-col",
  link: "flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-action-primary/50 focus:ring-offset-2 focus:ring-offset-surface-primary",
  icon: "mr-3 shrink-0",
  spacing: {
    compact: "gap-1 p-3",
    normal: "gap-2 p-4",
    relaxed: "gap-4 p-6",
  } as const,
  fontSize: {
    small: "text-sm",
    normal: "text-base",
    large: "text-lg",
  } as const,
  transition: {
    enabled: "transition-colors duration-150",
    disabled: "",
  } as const,
  contrast: {
    normalActive: "bg-action-primary/10 text-action-primary font-medium",
    normalInactive: "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
    highActive: "bg-action-primary/20 text-action-primary font-semibold border-l-2 border-action-primary",
    highInactive: "text-text-secondary hover:bg-surface-secondary hover:text-text-primary border-l-2 border-transparent hover:border-border-strong",
  } as const,
} as const;

/**
 * Get spacing classes based on user preference
 */
export function getSpacingClasses(spacing: UserPreferences["spacing"]): string {
  switch (spacing) {
    case "compact":
      return styles.spacing.compact;
    case "relaxed":
      return styles.spacing.relaxed;
    default:
      return styles.spacing.normal;
  }
}

/**
 * Get font size classes based on user preference
 */
export function getFontSizeClasses(fontSize: UserPreferences["fontSize"]): string {
  switch (fontSize) {
    case "small":
      return styles.fontSize.small;
    case "large":
      return styles.fontSize.large;
    default:
      return styles.fontSize.normal;
  }
}

/**
 * Get transition classes based on animation preference
 */
export function getTransitionClasses(animations: boolean): string {
  return animations ? styles.transition.enabled : styles.transition.disabled;
}

/**
 * Get contrast-aware classes based on contrast preference and active state
 */
export function getContrastClasses(
  contrast: UserPreferences["contrast"],
  isActive: boolean
): string {
  if (contrast === "high") {
    return isActive
      ? styles.contrast.highActive
      : styles.contrast.highInactive;
  }

  return isActive ? styles.contrast.normalActive : styles.contrast.normalInactive;
}

