import { UserPreferences } from "@/models/user-preferences";

/**
 * Sidebar Styles - MindEase
 * Centralized styles and utility functions for sidebar components
 */

export const styles = {
  aside: "bg-surface-primary border-r border-border-subtle",
  nav: "flex flex-col",
  link: "flex items-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-action-primary/50 focus:ring-offset-2 focus:ring-offset-surface-primary",
  icon: "mr-3 shrink-0",
  // Mobile drawer styles
  overlay: "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
  container: "fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out",
  containerOpen: "translate-x-0",
  containerClosed: "-translate-x-full md:translate-x-0",
  contrast: {
    // Normal contrast: subtle, low stimulation
    normalActive: "bg-action-primary/10 text-action-primary font-medium",
    normalInactive: "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
    
    // High contrast: semi-bold, clear visual distinction with stronger borders and backgrounds
    highActive: "bg-action-primary/30 text-action-primary font-semibold border-l-4 border-action-primary shadow-sm",
    highInactive: "text-text-primary border-l-4 border-transparent hover:bg-action-primary/15 hover:text-action-primary hover:border-action-primary/50 font-medium",
  } as const,
} as const;

/**
 * Get contrast-aware classes based on contrast preference and active state
 * 
 * Note: This is sidebar-specific logic that extends the base contrast classes
 * from utils/accessibility/tailwind-classes.ts with active/inactive states.
 * 
 * For general contrast classes, use useCognitiveSettings().contrastClasses
 */

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

