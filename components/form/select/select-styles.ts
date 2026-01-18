import { UserPreferences } from '@/models/user-preferences';

/**
 * Select Styles - MindEase
 * Centralized styles and utility functions for select components
 */

export const styles = {
  container: 'flex flex-col',
  label: 'font-medium text-text-primary',
  field: {
    base: 'px-4 rounded-md border bg-surface-primary text-text-primary appearance-none cursor-pointer focus:outline-none data-[focus]:ring-2 data-[focus]:ring-action-primary data-[focus]:border-transparent data-[hover]:opacity-90 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none data-[invalid]:border-feedback-error data-[invalid]:ring-feedback-error/50',
    select: 'h-10 pr-10',
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
        'data-[focus]:ring-4 data-[focus]:ring-action-primary/50 data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-action-primary/30',
    },
  } as const,
} as const;

/**
 * Get contrast-aware classes for select field
 *
 * Note: This is select-specific logic that extends the base contrast classes
 * from utils/accessibility/tailwind-classes.ts with field-specific styling.
 *
 * Uses Headless UI data attributes (data-[focus], data-[hover]) for state-based styling.
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
