import { UserPreferences } from "@/models/user-preferences";

/**
 * Button Styles - MindEase
 * Centralized styles and utility functions for button components
 */

export const styles = {
  base: "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  variants: {
    primary: "bg-action-primary text-text-inverse hover:opacity-90 focus:ring-action-primary active:opacity-80",
    secondary: "bg-surface-secondary text-text-primary hover:bg-surface-tertiary focus:ring-action-primary active:bg-surface-tertiary",
    ghost: "bg-transparent text-text-primary hover:bg-surface-secondary focus:ring-action-primary active:bg-surface-secondary",
    danger: "bg-action-danger text-text-inverse hover:opacity-90 focus:ring-action-danger active:opacity-80",
    warning: "bg-action-warning text-text-inverse hover:opacity-90 focus:ring-action-warning active:opacity-80",
  } as const,
  sizes: {
    sm: {
      height: "h-8",
      padding: "px-3",
    },
    md: {
      height: "h-10",
      padding: "px-4",
    },
    lg: {
      height: "h-12",
      padding: "px-6",
    },
  } as const,
  disabled: "opacity-50 cursor-not-allowed pointer-events-none",
  contrast: {
    // Normal contrast: standard transitions
    normal: "transition-colors duration-150",
    
    // High contrast: bold, clear visual distinction with thicker borders, outlines, and shadows
    high: {
      base: "border-4 transition-colors duration-150 outline outline-2 outline-offset-2 shadow-lg",
      primary: "border-action-primary outline-action-primary/30",
      secondary: "border-border-strong outline-border-strong/50",
      ghost: "border-text-primary outline-text-primary/30",
      danger: "border-action-danger outline-action-danger/30",
      warning: "border-action-warning outline-action-warning/30",
    } as const,
  } as const,
} as const;

/**
 * Get size classes for button
 * Combines height and padding based on size prop
 * Note: Gap is handled by spacing preference via useCognitiveSettings hook
 */
export function getSizeClasses(size: "sm" | "md" | "lg"): string {
  const sizeConfig = styles.sizes[size];
  return `${sizeConfig.height} ${sizeConfig.padding}`;
}

/**
 * Get contrast-aware classes for button
 * 
 * Note: This is button-specific logic that extends the base contrast classes
 * from utils/accessibility/tailwind-classes.ts with variant-specific borders.
 * 
 * For general contrast classes, use useCognitiveSettings().contrastClasses
 */
export function getContrastClasses(
  contrast: UserPreferences["contrast"],
  variant: "primary" | "secondary" | "ghost" | "danger" | "warning"
): string {
  if (contrast === "high") {
    const borderClass = styles.contrast.high[variant];
    return `${styles.contrast.high.base} ${borderClass}`;
  }

  return styles.contrast.normal;
}

