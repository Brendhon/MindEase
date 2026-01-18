'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { cn } from '@/utils/ui';
import { Field as HeadlessField } from '@headlessui/react';
import { ReactNode, useMemo } from 'react';
import { InputError } from './input-error';
import { InputField } from './input-field';
import { InputLabel } from './input-label';
import { styles } from './input-styles';

/**
 * Input Component - MindEase
 * Accessible input with cognitive accessibility features
 *
 * Uses composition pattern exclusively - only accepts Input subcomponents:
 * - Input.Label for labels
 * - Input.Field for input/textarea elements
 * - Input.Error for error messages
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input>
 *   <Input.Label htmlFor="email">Email</Input.Label>
 *   <Input.Field id="email" type="email" />
 * </Input>
 *
 * // With error
 * <Input>
 *   <Input.Label htmlFor="email">Email</Input.Label>
 *   <Input.Field id="email" type="email" />
 *   <Input.Error>Please enter a valid email</Input.Error>
 * </Input>
 *
 * // Textarea
 * <Input>
 *   <Input.Label htmlFor="description">Description</Input.Label>
 *   <Input.Field id="description" as="textarea" />
 * </Input>
 * ```
 */
export interface InputProps {
  children: ReactNode; // Only accepts Input subcomponents
  className?: string;
}

export function Input({ children, className }: InputProps) {
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

// Compose Input with subcomponents
export const InputRoot = Object.assign(Input, {
  Label: InputLabel,
  Field: InputField,
  Error: InputError,
});
