'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { FormErrorProps } from '@/models/form';
import { cn } from '@/utils/ui';
import { useMemo } from 'react';
import { styles } from './select-styles';

/**
 * Select.Error - Error message subcomponent
 * Use this for displaying error messages
 *
 * @example
 * ```tsx
 * <Select>
 *   <Select.Label htmlFor="country">Country</Select.Label>
 *   <Select.Field id="country">
 *     <option value="">Select a country</option>
 *   </Select.Field>
 *   <Select.Error>Please select a country</Select.Error>
 * </Select>
 * ```
 */
export function SelectError({ children, id, className }: FormErrorProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  // Font size automatically updates when user preferences change
  const { fontSizeClasses } = useAccessibilityClasses();

  // Get fontSize class (use sm for error messages)
  const fontSizeClass = useMemo(() => fontSizeClasses.sm, [fontSizeClasses.sm]);

  return (
    <p
      id={id}
      className={cn(styles.error, fontSizeClass, className)} // Dynamically updates based on settings.fontSize
      role="alert"
    >
      {children}
    </p>
  );
}

SelectError.displayName = 'Select.Error';
