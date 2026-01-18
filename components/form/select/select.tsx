'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { cn } from '@/utils/ui';
import { Field as HeadlessField } from '@headlessui/react';
import { ReactNode, useMemo } from 'react';
import { SelectError } from './select-error';
import { SelectField } from './select-field';
import { SelectLabel } from './select-label';
import { styles } from './select-styles';

/**
 * Select Component - MindEase
 * Accessible select with cognitive accessibility features
 *
 * Uses composition pattern exclusively - only accepts Select subcomponents:
 * - Select.Label for labels
 * - Select.Field for select elements
 * - Select.Error for error messages
 *
 * @example
 * ```tsx
 * // Basic select
 * <Select>
 *   <Select.Label htmlFor="country">Country</Select.Label>
 *   <Select.Field id="country">
 *     <option value="">Select a country</option>
 *     <option value="br">Brazil</option>
 *     <option value="us">United States</option>
 *   </Select.Field>
 * </Select>
 *
 * // With error
 * <Select>
 *   <Select.Label htmlFor="country">Country</Select.Label>
 *   <Select.Field id="country">
 *     <option value="">Select a country</option>
 *   </Select.Field>
 *   <Select.Error>Please select a country</Select.Error>
 * </Select>
 * ```
 */
export interface SelectProps {
  children: ReactNode; // Only accepts Select subcomponents
  className?: string;
}

export function Select({ children, className }: SelectProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  // Gap automatically updates when user preferences change
  const { spacingClasses } = useAccessibilityClasses();

  // Generate container classes with spacing preference
  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap), // Dynamically updates based on settings.spacing
    [spacingClasses.gap]
  );

  return (
    <HeadlessField className={cn(containerClasses, className)}>
      {children}
    </HeadlessField>
  );
}

// Compose Select with subcomponents
export const SelectRoot = Object.assign(Select, {
  Label: SelectLabel,
  Field: SelectField,
  Error: SelectError,
});
