import { UserPreferences } from '@/models/user-preferences';

/**
 * Input Styles - MindEase
 * Centralized styles and utility functions for input components
 */

export const styles = {
  container: 'flex flex-col',
  label: 'font-medium text-text-primary',
  field: {
    base: 'px-4 rounded-md border bg-surface-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent',
    input: 'h-10',
    textarea: 'min-h-24 py-2 resize-y',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
  } as const,
  error: 'text-sm text-feedback-error',
  contrast: {
    // Normal contrast: standard transitions
    normal: 'transition-colors duration-150',

    // High contrast: stronger borders and outlines for better visibility
    high: {
      base: 'border-2 transition-colors duration-150',
      focus:
        'focus:ring-4 focus:ring-action-primary/50 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-action-primary/30',
    },
  } as const,
} as const;

/**
 * Get contrast-aware classes for input field
 *
 * Note: This is input-specific logic that extends the base contrast classes
 * from utils/accessibility/tailwind-classes.ts with field-specific styling.
 *
 * For general contrast classes, use useCognitiveSettings().contrastClasses
 */
export function getContrastClasses(contrast: UserPreferences['contrast']): {
  base: string;
  focus: string;
} {
  if (contrast === 'high') {
    return {
      base: styles.contrast.high.base,
      focus: styles.contrast.high.focus,
    };
  }

  return {
    base: styles.contrast.normal,
    focus: '',
  };
}
