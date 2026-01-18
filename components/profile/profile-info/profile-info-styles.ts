import { UserPreferences } from '@/models/user-preferences';
import { getContrastClasses } from '@/utils/accessibility';

/**
 * Profile Info Styles - MindEase
 * Centralized styles and utility functions for profile info components
 */

export const styles = {
  // Container styles
  container: 'flex flex-col w-full max-w-4xl mx-auto',

  // Error message styles
  error: 'text-action-danger text-center',

  // Card styles
  infoCard:
    'flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8',
  avatarSection: 'flex-shrink-0',
  infoSection: 'flex flex-col gap-4 flex-1 min-w-0',

  // Info row styles
  infoRow: 'flex flex-col gap-1.5',
  label: 'text-text-secondary font-medium text-sm',
  value: 'text-text-primary font-normal break-words',

  // Avatar styles
  avatarContainer: 'flex justify-center',
  avatar:
    'rounded-full w-24 h-24 object-cover border-2 border-border-subtle shadow-md transition-shadow hover:shadow-lg',
  initialsContainer:
    'flex items-center justify-center text-text-inverse font-semibold text-2xl select-none shadow-md transition-shadow hover:shadow-lg',
  initials: 'leading-none',

  // Actions styles
  actions: 'flex justify-end gap-3',

  // Contrast-specific styles
  contrast: {
    // Normal contrast: standard transitions
    normal: 'transition-colors duration-150',

    // High contrast: enhanced borders and outlines for better visibility
    high: {
      base: 'border-2 transition-colors duration-150 outline outline-2 outline-offset-2',
      avatar: 'border-4 outline-border-strong/50',
      card: 'border-2 border-border-strong outline-border-strong/30',
    } as const,
  } as const,
} as const;

/**
 * Get contrast-aware classes for profile info components
 *
 * @param contrast - Contrast mode from user preferences
 * @param component - Component type to get specific contrast classes
 * @returns Combined contrast classes string
 *
 * @example
 * ```tsx
 * const classes = getContrastClassesForProfile("high", "avatar");
 * // Returns: "transition-colors duration-200 contrast-more border-4 outline-border-strong/50 outline outline-2 outline-offset-2"
 * ```
 */
export function getContrastClassesForProfile(
  contrast: UserPreferences['contrast'],
  component?: 'avatar' | 'card'
): string {
  const baseContrast = getContrastClasses(contrast);

  if (contrast === 'high') {
    const componentClass = component ? styles.contrast.high[component] : '';
    const highContrastBase = styles.contrast.high.base;
    return [baseContrast, highContrastBase, componentClass]
      .filter(Boolean)
      .join(' ');
  }

  return baseContrast;
}
