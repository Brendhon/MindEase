import { UserPreferences } from "@/models/UserPreferences";

/**
 * Dialog Styles - MindEase
 * Centralized styles and utility functions for dialog components
 */

export const styles = {
  dialog: "relative z-50",
  backdrop: "fixed inset-0 bg-black/30",
  container: "fixed inset-0 flex items-center justify-center",
  panel: "w-full max-w-md rounded-lg bg-surface-primary shadow-lg",
  title: "font-semibold text-text-primary",
  contrast: {
    // Normal contrast: standard styling
    normal: {
      panel: "",
      title: "",
    },
    
    // High contrast: stronger borders, outlines, and shadows for better visibility
    high: {
      panel: "border-4 border-border-strong outline outline-2 outline-offset-2 outline-black/20 shadow-xl",
      title: "font-bold",
    },
  } as const,
  transition: {
    // Reduced motion: minimal transition for accessibility
    reduced: {
      backdrop: {
        enter: "transition-opacity duration-fast",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "transition-opacity duration-fast",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
      },
      panel: {
        enter: "transition-opacity duration-fast",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "transition-opacity duration-fast",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
      },
    },
    // Normal: full transition with easing
    normal: {
      backdrop: {
        enter: "ease-out duration-normal",
        enterFrom: "opacity-0",
        enterTo: "opacity-100",
        leave: "ease-in duration-normal",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
      },
      panel: {
        enter: "ease-out duration-normal",
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100",
        leave: "ease-in duration-normal",
        leaveFrom: "opacity-100 scale-100",
        leaveTo: "opacity-0 scale-95",
      },
    },
  } as const,
} as const;

/**
 * Get contrast-aware classes for dialog panel
 * 
 * Note: This is dialog-specific logic that extends the base contrast classes
 * from utils/accessibility/tailwind-classes.ts with panel-specific styling.
 * 
 * For general contrast classes, use useCognitiveSettings().contrastClasses
 */
export function getContrastClasses(
  contrast: UserPreferences["contrast"]
): { panel: string; title: string } {
  if (contrast === "high") {
    return {
      panel: styles.contrast.high.panel,
      title: styles.contrast.high.title,
    };
  }

  return {
    panel: styles.contrast.normal.panel,
    title: styles.contrast.normal.title,
  };
}

/**
 * Get transition classes based on animation preference
 * 
 * Note: This is dialog-specific logic for Transition components from Headless UI.
 * For general animation classes, use useCognitiveSettings().animationClasses
 */
export function getTransitionClasses(animations: boolean) {
  return animations ? styles.transition.normal : styles.transition.reduced;
}

